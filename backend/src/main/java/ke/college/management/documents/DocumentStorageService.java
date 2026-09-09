package ke.college.management.documents;

import ke.college.management.audit.AuditService;
import ke.college.management.documents.entity.DocumentRecord;
import ke.college.management.documents.repository.DocumentRepository;
import ke.college.management.exceptions.BadRequestException;
import ke.college.management.exceptions.ResourceNotFoundException;
import ke.college.management.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestClient;
import org.springframework.web.multipart.MultipartFile;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Duration;
import java.time.Instant;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HexFormat;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class DocumentStorageService {

    private final DocumentRepository documentRepository;
    private final AuditService auditService;

    @Value("${app.storage.endpoint:http://localhost:9000}")
    private String endpoint;

    @Value("${app.storage.bucket:college-erp-documents}")
    private String bucket;

    @Value("${app.storage.access-key:minioadmin}")
    private String accessKey;

    @Value("${app.storage.secret-key:minioadmin}")
    private String secretKey;

    @Value("${app.storage.region:us-east-1}")
    private String region;

    private static final long MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB
    private static final Set<String> ALLOWED_MIME_TYPES = Set.of(
            "application/pdf",
            "image/jpeg",
            "image/png",
            "image/webp",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );

    private final RestClient restClient = RestClient.builder().build();

    /**
     * Uploads document file to MinIO / S3 and stores metadata in PostgreSQL
     */
    @Transactional
    public DocumentRecord uploadDocument(
            MultipartFile file,
            String documentType,
            String studentId,
            String title
    ) {
        String institutionId = SecurityUtils.getCurrentInstitutionId();
        String currentUserId = SecurityUtils.getCurrentUserId();

        if (file.isEmpty()) {
            throw new BadRequestException("Uploaded file cannot be empty");
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new BadRequestException("File size exceeds maximum permitted limit of 25MB");
        }

        String mimeType = file.getContentType();
        if (mimeType == null || !ALLOWED_MIME_TYPES.contains(mimeType.toLowerCase())) {
            throw new BadRequestException("Invalid or unsupported file type: " + mimeType);
        }

        try {
            byte[] fileBytes = file.getBytes();
            String sha256 = calculateSha256(fileBytes);

            String originalName = file.getOriginalFilename() != null ? file.getOriginalFilename().replaceAll("[^a-zA-Z0-9._-]", "_") : "doc";
            String fileKey = String.format("%s/%s/%s_%s", institutionId, documentType.toLowerCase(), UUID.randomUUID().toString().substring(0, 8), originalName);
            String verificationCode = "VER-" + UUID.randomUUID().toString().replace("-", "").substring(0, 16).toUpperCase();

            // Store in S3 / MinIO object storage
            storeInS3(fileKey, fileBytes, mimeType);

            DocumentRecord record = DocumentRecord.builder()
                    .id("doc_" + UUID.randomUUID().toString().replace("-", "").substring(0, 16))
                    .institutionId(institutionId)
                    .documentType(documentType)
                    .studentId(studentId)
                    .title(title != null && !title.isBlank() ? title : originalName)
                    .fileKey(fileKey)
                    .fileSize(file.getSize())
                    .mimeType(mimeType)
                    .hashSha256(sha256)
                    .verificationCode(verificationCode)
                    .isVerified(true)
                    .createdBy(currentUserId)
                    .createdAt(Instant.now())
                    .build();

            DocumentRecord saved = documentRepository.save(record);

            auditService.recordEvent(
                    institutionId,
                    currentUserId,
                    SecurityUtils.getCurrentUserDetails().getIdentifier(),
                    "DOCUMENT_UPLOAD",
                    "DOCUMENT",
                    saved.getId(),
                    "SUCCESS",
                    null, null, null,
                    "Document uploaded: " + saved.getTitle() + " (" + documentType + ")",
                    null, null
            );

            return saved;
        } catch (IOException e) {
            log.error("Failed to read uploaded file: {}", e.getMessage());
            throw new BadRequestException("Failed to read file payload: " + e.getMessage());
        }
    }

    /**
     * Generates an AWS Signature Version 4 pre-signed GET URL for secure direct client download
     */
    public String generatePresignedUrl(String documentId, Duration expiration) {
        DocumentRecord doc = documentRepository.findById(documentId)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found"));
        SecurityUtils.validateTenantAccess(doc.getInstitutionId());

        return createSigV4PresignedUrl(doc.getFileKey(), expiration != null ? expiration : Duration.ofMinutes(15));
    }

    /**
     * Downloads the raw object bytes (for server-side streaming or archival verification)
     */
    public byte[] downloadDocumentBytes(String documentId) {
        DocumentRecord doc = documentRepository.findById(documentId)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found"));
        SecurityUtils.validateTenantAccess(doc.getInstitutionId());

        return fetchFromS3(doc.getFileKey());
    }

    @Transactional
    public void deleteDocument(String documentId) {
        DocumentRecord doc = documentRepository.findById(documentId)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found"));
        SecurityUtils.validateTenantAccess(doc.getInstitutionId());

        deleteFromS3(doc.getFileKey());
        documentRepository.delete(doc);

        auditService.recordEvent(
                doc.getInstitutionId(),
                SecurityUtils.getCurrentUserId(),
                SecurityUtils.getCurrentUserDetails().getIdentifier(),
                "DOCUMENT_DELETE",
                "DOCUMENT",
                doc.getId(),
                "SUCCESS",
                null, null, null,
                "Document deleted: " + doc.getTitle(),
                null, null
        );
    }

    @Transactional(readOnly = true)
    public List<DocumentRecord> getStudentDocuments(String studentId) {
        String institutionId = SecurityUtils.getCurrentInstitutionId();
        return documentRepository.findByInstitutionIdAndStudentId(institutionId, studentId);
    }

    @Transactional(readOnly = true)
    public List<DocumentRecord> getInstitutionDocuments() {
        String institutionId = SecurityUtils.getCurrentInstitutionId();
        return documentRepository.findByInstitutionId(institutionId);
    }

    // --- S3 / MinIO helper methods using standard HTTP + SigV4 ---

    private void storeInS3(String key, byte[] content, String contentType) {
        String url = String.format("%s/%s/%s", endpoint.replaceAll("/$", ""), bucket, key);
        try {
            // Upload to MinIO/S3 endpoint
            restClient.put()
                    .uri(url)
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_LENGTH, String.valueOf(content.length))
                    .body(content)
                    .retrieve()
                    .toBodilessEntity();
            log.info("Successfully stored document in S3: {}", key);
        } catch (Exception ex) {
            log.warn("MinIO S3 upload direct PUT failed ({}), storing in persistent local cache fallback", ex.getMessage());
            saveToLocalFallback(key, content);
        }
    }

    private byte[] fetchFromS3(String key) {
        String url = String.format("%s/%s/%s", endpoint.replaceAll("/$", ""), bucket, key);
        try {
            return restClient.get()
                    .uri(url)
                    .retrieve()
                    .body(byte[].class);
        } catch (Exception ex) {
            log.warn("Failed to retrieve from S3 ({}), checking local storage fallback", ex.getMessage());
            return fetchFromLocalFallback(key);
        }
    }

    private void deleteFromS3(String key) {
        String url = String.format("%s/%s/%s", endpoint.replaceAll("/$", ""), bucket, key);
        try {
            restClient.delete()
                    .uri(url)
                    .retrieve()
                    .toBodilessEntity();
        } catch (Exception ex) {
            log.warn("Failed to delete from S3 ({})", ex.getMessage());
            File fallbackFile = new File("/tmp/college-erp-documents/" + key);
            if (fallbackFile.exists()) {
                fallbackFile.delete();
            }
        }
    }

    private void saveToLocalFallback(String key, byte[] content) {
        try {
            File file = new File("/tmp/college-erp-documents/" + key);
            file.getParentFile().mkdirs();
            try (FileOutputStream fos = new FileOutputStream(file)) {
                fos.write(content);
            }
        } catch (IOException e) {
            log.error("Could not write to local fallback: {}", e.getMessage());
        }
    }

    private byte[] fetchFromLocalFallback(String key) {
        try {
            File file = new File("/tmp/college-erp-documents/" + key);
            if (file.exists()) {
                return java.nio.file.Files.readAllBytes(file.toPath());
            }
        } catch (IOException e) {
            log.error("Could not read local fallback: {}", e.getMessage());
        }
        return new byte[0];
    }

    /**
     * Creates AWS SigV4 signed URL for S3/MinIO
     */
    private String createSigV4PresignedUrl(String key, Duration expiration) {
        ZonedDateTime now = ZonedDateTime.now(ZoneOffset.UTC);
        String dateStamp = now.format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String amzDate = now.format(DateTimeFormatter.ofPattern("yyyyMMdd'T'HHmmss'Z'"));
        String credentialScope = String.format("%s/%s/s3/aws4_request", dateStamp, region);

        long expSeconds = expiration.getSeconds();
        String host = endpoint.replaceAll("^https?://", "").replaceAll("/.*$", "");

        String canonicalUri = "/" + bucket + "/" + key;
        String canonicalQuery = String.format(
                "X-Amz-Algorithm=AWS4-HMAC-SHA256" +
                "&X-Amz-Credential=%s" +
                "&X-Amz-Date=%s" +
                "&X-Amz-Expires=%d" +
                "&X-Amz-SignedHeaders=host",
                URLEncoder.encode(accessKey + "/" + credentialScope, StandardCharsets.UTF_8),
                amzDate,
                expSeconds
        );

        String canonicalRequest = "GET\n" +
                canonicalUri + "\n" +
                canonicalQuery + "\n" +
                "host:" + host + "\n\n" +
                "host\n" +
                "UNSIGNED-PAYLOAD";

        String stringToSign = "AWS4-HMAC-SHA256\n" +
                amzDate + "\n" +
                credentialScope + "\n" +
                sha256Hex(canonicalRequest);

        byte[] signingKey = getSignatureKey(secretKey, dateStamp, region, "s3");
        String signature = HexFormat.of().formatHex(hmacSha256(stringToSign, signingKey));

        return String.format("%s/%s/%s?%s&X-Amz-Signature=%s",
                endpoint.replaceAll("/$", ""),
                bucket,
                key,
                canonicalQuery,
                signature
        );
    }

    private static String calculateSha256(byte[] data) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(data);
            return HexFormat.of().formatHex(hash);
        } catch (Exception e) {
            throw new RuntimeException("SHA-256 algorithm unavailable", e);
        }
    }

    private static String sha256Hex(String text) {
        return calculateSha256(text.getBytes(StandardCharsets.UTF_8));
    }

    private static byte[] hmacSha256(String data, byte[] key) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(key, "HmacSHA256"));
            return mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
        } catch (Exception e) {
            throw new RuntimeException("Failed to calculate HMAC-SHA256", e);
        }
    }

    private static byte[] getSignatureKey(String key, String dateStamp, String regionName, String serviceName) {
        byte[] kSecret = ("AWS4" + key).getBytes(StandardCharsets.UTF_8);
        byte[] kDate = hmacSha256(dateStamp, kSecret);
        byte[] kRegion = hmacSha256(regionName, kDate);
        byte[] kService = hmacSha256(serviceName, kRegion);
        return hmacSha256("aws4_request", kService);
    }
}
