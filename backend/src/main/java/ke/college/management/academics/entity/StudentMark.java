package ke.college.management.academics.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Version;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "student_marks")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentMark {

    @Id
    @Column(length = 64)
    private String id;

    @Column(name = "assessment_id", nullable = false, length = 64)
    private String assessmentId;

    @Column(name = "student_id", nullable = false, length = 64)
    private String studentId;

    @Column(nullable = false)
    private BigDecimal score;

    @Column(name = "entered_by", nullable = false, length = 64)
    private String enteredBy;

    @Column(length = 32)
    @Builder.Default
    private String status = "DRAFT"; // DRAFT, SUBMITTED, MODERATED, APPROVED, PUBLISHED

    @Column(name = "created_at", updatable = false)
    @Builder.Default
    private Instant createdAt = Instant.now();

    @Column(name = "updated_at")
    @Builder.Default
    private Instant updatedAt = Instant.now();

    @Version
    private Integer version;
}
