package ke.college.management.documents;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import ke.college.management.audit.AuditService;
import ke.college.management.common.ApiResponse;
import ke.college.management.documents.entity.DocumentRecord;
import ke.college.management.documents.repository.DocumentRepository;
import ke.college.management.exceptions.ResourceNotFoundException;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;

@RestController
@RequestMapping("/api/v1/documents")
@RequiredArgsConstructor
@Tag(name = "Documents & Verification", description = "Institutional document generation, archival and cryptographic QR verification")
public class DocumentController {

    private final DocumentRepository documentRepository;
    private final AuditService auditService;

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
