package ke.college.management.documents.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Entity
@Table(name = "documents")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DocumentRecord {

    @Id
    @Column(length = 64)
    private String id;

    @Column(name = "institution_id", nullable = false, length = 64)
    private String institutionId;

    @Column(name = "document_type", nullable = false, length = 64)
    private String documentType; // TRANSCRIPT, RECEIPT, ADMISSION_LETTER, CLEARANCE_CERT

    @Column(name = "student_id", length = 64)
    private String studentId;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(name = "file_key", nullable = false, unique = true, length = 255)
    private String fileKey;

    @Column(name = "file_size")
    private Long fileSize;

    @Column(name = "mime_type", length = 128)
    @Builder.Default
    private String mimeType = "application/pdf";

    @Column(name = "hash_sha256", length = 128)
    private String hashSha256;

    @Column(name = "verification_code", nullable = false, unique = true, length = 64)
    private String verificationCode;

    @Column(name = "is_verified")
    @Builder.Default
    private Boolean isVerified = true;

    @Column(name = "created_by", nullable = false, length = 64)
    private String createdBy;

    @Column(name = "created_at", updatable = false)
    @Builder.Default
    private Instant createdAt = Instant.now();
}
