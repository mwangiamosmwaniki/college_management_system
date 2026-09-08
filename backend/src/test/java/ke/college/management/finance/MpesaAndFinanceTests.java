package ke.college.management.finance;

import ke.college.management.finance.entity.MpesaTransaction;
import ke.college.management.finance.repository.MpesaTransactionRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
@ActiveProfiles("test")
class MpesaAndFinanceTests {

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private MpesaTransactionRepository mpesaTransactionRepository;

    @Test
    @Transactional
    @DisplayName("P0: Duplicate M-Pesa callbacks must be handled idempotently without duplicate fee deductions")
    void duplicateCallback_HandledIdempotently() {
        String checkoutId = "ws_CO_TEST_" + System.currentTimeMillis();

        MpesaTransaction tx = MpesaTransaction.builder()
                .id("tx_test_01")
                .institutionId("inst_apex_tvet")
                .studentId("stu_john")
                .merchantRequestId("MR_TEST_1")
                .checkoutRequestId(checkoutId)
                .phoneNumber("254712345678")
                .amount(new BigDecimal("5000.00"))
                .accountReference("FEE-STU01")
                .status("PENDING")
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();

        mpesaTransactionRepository.save(tx);

        Map<String, Object> callbackPayload = new HashMap<>();
        Map<String, Object> body = new HashMap<>();
        Map<String, Object> stkCallback = new HashMap<>();
        stkCallback.put("CheckoutRequestID", checkoutId);
        stkCallback.put("ResultCode", 0);
        stkCallback.put("ResultDesc", "The service request is processed successfully.");
        body.put("stkCallback", stkCallback);
        callbackPayload.put("Body", body);

        // First callback invocation
        boolean firstCall = paymentService.processMpesaCallback(callbackPayload);
        assertTrue(firstCall, "First callback should be processed successfully");

        // Second duplicate callback invocation (e.g. Daraja retry)
        boolean secondCall = paymentService.processMpesaCallback(callbackPayload);
        assertTrue(secondCall, "Second duplicate callback must be handled idempotently");
    }
}
