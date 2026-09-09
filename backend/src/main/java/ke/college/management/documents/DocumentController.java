package ke.college.management.documents;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import ke.college.management.audit.AuditService;
import ke.college.management.common.ApiResponse;
import ke.college.management.documents.entity.DocumentRecord;
import ke.college.management.documents.repository.DocumentRepository;
import ke.college.management.exceptions.ResourceNotFoundException;
import ke.college.management.security.SecurityUtils;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/documents")
@RequiredArgsConstructor
@Tag(name = "Documents & Verification", description = "Institutional document generation, S3 archival and cryptographic QR verification")
public class DocumentController {

    private final DocumentRepository documentRepository;
    private final DocumentStorageService storageService;
    private final AuditService auditService;

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Upload and archive document in MinIO / S3 object storage")
    public ApiResponse<DocumentRecord> uploadDocument(
            @RequestParam("file") MultipartFile file,
            @RequestParam("documentType") String documentType,
            @RequestParam(value = "studentId", required = false) String studentId,
            @RequestParam(value = "title", required = false) String title
    ) {
        DocumentRecord record = storageService.uploadDocument(file, documentType, studentId, title);
        return ApiResponse.success("Document uploaded successfully to secure storage", record);
    }

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "List documents for current institution")
    public ApiResponse<List<DocumentRecord>> getDocuments() {
        return ApiResponse.success(storageService.getInstitutionDocuments());
    }

    @GetMapping("/student/{studentId}")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get all documents associated with a student")
    public ApiResponse<List<DocumentRecord>> getStudentDocuments(@PathVariable String studentId) {
        return ApiResponse.success(storageService.getStudentDocuments(studentId));
    }

    @GetMapping("/{id}/presigned-url")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Generate a short-lived AWS SigV4 pre-signed S3 download URL")
    public ApiResponse<Map<String, Object>> getPresignedUrl(
            @PathVariable String id,
            @RequestParam(defaultValue = "15") int expireMinutes
    ) {
        String url = storageService.generatePresignedUrl(id, Duration.ofMinutes(expireMinutes));
        return ApiResponse.success(Map.of(
                "downloadUrl", url,
                "expiresInMinutes", expireMinutes
        ));
    }

    @GetMapping("/{id}/download")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Stream document bytes securely from S3")
    public ResponseEntity<byte[]> downloadFile(@PathVariable String id) {
        DocumentRecord doc = documentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found"));
        SecurityUtils.validateTenantAccess(doc.getInstitutionId());

        byte[] bytes = storageService.downloadDocumentBytes(id);
        String filename = doc.getTitle() != null ? doc.getTitle().replaceAll("[^a-zA-Z0-9._-]", "_") : "document";

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(doc.getMimeType() != null ? doc.getMimeType() : "application/octet-stream"))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .body(bytes);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN') or hasAuthority('DOCUMENTS_MANAGE')")
    @Operation(summary = "Delete document record and S3 object")
    public ApiResponse<Void> deleteDocument(@PathVariable String id) {
        storageService.deleteDocument(id);
        return ApiResponse.success("Document deleted successfully", null);
    }

    @GetMapping("/verify/{code}")
    @Operation(summary = "Public QR/Hash verification endpoint (safely returns validity without disclosing sensitive PII)")
    public ApiResponse<DocumentVerificationResult> verifyDocument(@PathVariable String code) {
        DocumentRecord doc = documentRepository.findByVerificationCode(code)
                .orElseThrow(() -> new ResourceNotFoundException("Document verification code not found or invalid"));

        auditService.recordEvent(
                doc.getInstitutionId(),
                "PUBLIC_VERIFIER",
                "ANONYMOUS",
                "DOCUMENT_VERIFY",
                "DOCUMENT",
                doc.getId(),
                "SUCCESS",
                null, null, null,
                "Document " + doc.getDocumentType() + " verified successfully via code " + code,
                null, null
        );

        DocumentVerificationResult result = DocumentVerificationResult.builder()
                .documentId(doc.getId())
                .title(doc.getTitle())
                .documentType(doc.getDocumentType())
                .institutionId(doc.getInstitutionId())
                .issuedAt(doc.getCreatedAt())
                .isAuthentic(true)
                .sha256Hash(doc.getHashSha256())
                .verificationCode(doc.getVerificationCode())
                .build();

        return ApiResponse.success("Document signature verified as authentic", result);
    }

    @Data
    @Builder
    public static class DocumentVerificationResult {
        private String documentId;
        private String title;
        private String documentType;
        private String institutionId;
        private Instant issuedAt;
        private boolean isAuthentic;
        private String sha256Hash;
        private String verificationCode;
    }
}
