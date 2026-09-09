package ke.college.management.finance.daraja;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import ke.college.management.exceptions.BadRequestException;
import lombok.Builder;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

@Service
@Slf4j
public class DarajaService {

    private final ObjectMapper objectMapper;
    private final RestClient restClient;

    @Value("${app.mpesa.env:sandbox}")
    private String environment;

    @Value("${app.mpesa.consumer-key:}")
    private String consumerKey;

    @Value("${app.mpesa.consumer-secret:}")
    private String consumerSecret;

    @Value("${app.mpesa.passkey:}")
    private String passkey;

    @Value("${app.mpesa.shortcode:174379}")
    private String shortcode;

    @Value("${app.mpesa.callback-url:https://api.institution.edu/api/v1/payments/mpesa/callback}")
    private String callbackUrl;

    private String cachedToken;
    private Instant tokenExpiryTime;

    public DarajaService(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
        this.restClient = RestClient.builder().build();
    }

    private String getBaseUrl() {
        return "production".equalsIgnoreCase(environment)
                ? "https://api.safaricom.co.ke"
                : "https://sandbox.safaricom.co.ke";
    }

    /**
     * Obtains an OAuth 2.0 bearer token from Daraja using client credentials
     */
    public synchronized String getAccessToken() {
        if (cachedToken != null && tokenExpiryTime != null && Instant.now().isBefore(tokenExpiryTime.minusSeconds(60))) {
            return cachedToken;
        }

        if (consumerKey == null || consumerKey.isBlank() || consumerSecret == null || consumerSecret.isBlank() ||
            "sandbox_consumer_key".equals(consumerKey)) {
            log.warn("M-Pesa Daraja credentials not configured or set to placeholder default.");
            throw new BadRequestException("M-Pesa gateway is currently unavailable. Please verify API credentials or try again later.");
        }

        String authString = consumerKey.trim() + ":" + consumerSecret.trim();
        String encodedAuth = Base64.getEncoder().encodeToString(authString.getBytes(StandardCharsets.UTF_8));
        String oauthUrl = getBaseUrl() + "/oauth/v1/generate?grant_type=client_credentials";

        try {
            String response = restClient.get()
                    .uri(oauthUrl)
                    .header(HttpHeaders.AUTHORIZATION, "Basic " + encodedAuth)
                    .header(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE)
                    .retrieve()
                    .body(String.class);

            JsonNode root = objectMapper.readTree(response);
            if (root.has("access_token")) {
                this.cachedToken = root.get("access_token").asText();
                long expiresIn = root.has("expires_in") ? root.get("expires_in").asLong() : 3599;
                this.tokenExpiryTime = Instant.now().plusSeconds(expiresIn);
                log.info("Successfully obtained fresh Daraja OAuth token (expires in {}s)", expiresIn);
                return this.cachedToken;
            } else {
                throw new BadRequestException("M-Pesa gateway authentication failed: " + response);
            }
        } catch (BadRequestException bre) {
            throw bre;
        } catch (Exception ex) {
            log.error("Failed to connect to Daraja OAuth endpoint [{}]: {}", oauthUrl, ex.getMessage());
            throw new BadRequestException("M-Pesa gateway is currently unavailable. Please verify API credentials or try again later.");
        }
    }

    /**
     * Initiates Daraja STK Push (processrequest)
     */
    public StkPushResult initiateStkPush(String phoneNumber, BigDecimal amount, String accountReference, String transactionDesc) {
        String token = getAccessToken();
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        String rawPassword = shortcode.trim() + passkey.trim() + timestamp;
        String password = Base64.getEncoder().encodeToString(rawPassword.getBytes(StandardCharsets.UTF_8));

        int amountInt = amount.intValue();
        if (amountInt <= 0) {
            throw new BadRequestException("Payment amount must be greater than zero");
        }

        Map<String, Object> payload = new HashMap<>();
        payload.put("BusinessShortCode", shortcode.trim());
        payload.put("Password", password);
        payload.put("Timestamp", timestamp);
        payload.put("TransactionType", "CustomerPayBillOnline");
        payload.put("Amount", amountInt);
        payload.put("PartyA", phoneNumber);
        payload.put("PartyB", shortcode.trim());
        payload.put("PhoneNumber", phoneNumber);
        payload.put("CallBackURL", callbackUrl);
        payload.put("AccountReference", accountReference != null ? accountReference : "FEE");
        payload.put("TransactionDesc", transactionDesc != null ? transactionDesc : "Fee Payment");

        String stkUrl = getBaseUrl() + "/mpesa/stkpush/v1/processrequest";

        try {
            String response = restClient.post()
                    .uri(stkUrl)
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(payload)
                    .retrieve()
                    .body(String.class);

            JsonNode root = objectMapper.readTree(response);
            String responseCode = root.path("ResponseCode").asText();

            if ("0".equals(responseCode)) {
                return StkPushResult.builder()
                        .merchantRequestId(root.path("MerchantRequestID").asText())
                        .checkoutRequestId(root.path("CheckoutRequestID").asText())
                        .responseCode(responseCode)
                        .responseDescription(root.path("ResponseDescription").asText())
                        .customerMessage(root.path("CustomerMessage").asText())
                        .isSuccess(true)
                        .build();
            } else {
                String errorDesc = root.path("ResponseDescription").asText("Transaction could not be processed");
                log.warn("Daraja STK Push rejected with code {}: {}", responseCode, errorDesc);
                return StkPushResult.builder()
                        .responseCode(responseCode)
                        .responseDescription(errorDesc)
                        .customerMessage(errorDesc)
                        .isSuccess(false)
                        .build();
            }
        } catch (Exception ex) {
            log.error("Exception during Daraja STK Push execution: {}", ex.getMessage());
            throw new BadRequestException("M-Pesa gateway is currently unavailable. Please verify API credentials or try again later.");
        }
    }

    /**
     * Queries Daraja STK Push status
     */
    public StkQueryResult queryStkStatus(String checkoutRequestId) {
        String token = getAccessToken();
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        String rawPassword = shortcode.trim() + passkey.trim() + timestamp;
        String password = Base64.getEncoder().encodeToString(rawPassword.getBytes(StandardCharsets.UTF_8));

        Map<String, Object> payload = new HashMap<>();
        payload.put("BusinessShortCode", shortcode.trim());
        payload.put("Password", password);
        payload.put("Timestamp", timestamp);
        payload.put("CheckoutRequestID", checkoutRequestId);

        String queryUrl = getBaseUrl() + "/mpesa/stkpushquery/v1/query";

        try {
            String response = restClient.post()
                    .uri(queryUrl)
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(payload)
                    .retrieve()
                    .body(String.class);

            JsonNode root = objectMapper.readTree(response);
            return StkQueryResult.builder()
                    .responseCode(root.path("ResponseCode").asText())
                    .responseDescription(root.path("ResponseDescription").asText())
                    .merchantRequestId(root.path("MerchantRequestID").asText())
                    .checkoutRequestId(root.path("CheckoutRequestID").asText())
                    .resultCode(root.path("ResultCode").asText())
                    .resultDesc(root.path("ResultDesc").asText())
                    .build();
        } catch (Exception ex) {
            log.error("Failed to query Daraja STK status for {}: {}", checkoutRequestId, ex.getMessage());
            throw new BadRequestException("Failed to query M-Pesa transaction status from Daraja gateway");
        }
    }

    @Data
    @Builder
    public static class StkPushResult {
        private String merchantRequestId;
        private String checkoutRequestId;
        private String responseCode;
        private String responseDescription;
        private String customerMessage;
        private boolean isSuccess;
    }

    @Data
    @Builder
    public static class StkQueryResult {
        private String responseCode;
        private String responseDescription;
        private String merchantRequestId;
        private String checkoutRequestId;
        private String resultCode;
        private String resultDesc;
    }
}
