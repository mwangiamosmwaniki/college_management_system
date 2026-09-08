package ke.college.management.admissions.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Version;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Entity
@Table(name = "applications")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Application {

    @Id
    @Column(length = 64)
    private String id;

    @Column(name = "institution_id", nullable = false, length = 64)
    private String institutionId;

    @Column(name = "reference_number", nullable = false, length = 64)
    private String referenceNumber;

    @Column(name = "full_name", nullable = false, length = 255)
    private String fullName;

    @Column(nullable = false, length = 255)
    private String email;

    @Column(name = "phone_number", nullable = false, length = 32)
    private String phoneNumber;

    @Column(name = "national_id", length = 64)
    private String nationalId;

    @Column(name = "program_id", nullable = false, length = 64)
    private String programId;

    @Column(name = "kcse_mean_grade", length = 8)
    private String kcseMeanGrade;

    @Column(name = "kcse_index_number", length = 64)
    private String kcseIndexNumber;

    @Column(name = "application_fee_paid")
    @Builder.Default
    private Boolean applicationFeePaid = false;

    @Column(name = "fee_reference", length = 64)
    private String feeReference;

    @Column(length = 32)
    @Builder.Default
    private String status = "SUBMITTED"; // SUBMITTED, UNDER_REVIEW, APPROVED, REJECTED, ADMITTED

    @Column(name = "reviewer_notes", columnDefinition = "TEXT")
    private String reviewerNotes;

    @Column(name = "reviewed_by", length = 64)
    private String reviewedBy;

    @Column(name = "reviewed_at")
    private Instant reviewedAt;

    @Column(name = "created_at", updatable = false)
    @Builder.Default
    private Instant createdAt = Instant.now();

    @Column(name = "updated_at")
    @Builder.Default
    private Instant updatedAt = Instant.now();

    @Version
    private Long version;
}
