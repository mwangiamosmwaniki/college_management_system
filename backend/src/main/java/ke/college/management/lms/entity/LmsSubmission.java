package ke.college.management.lms.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "lms_submissions")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LmsSubmission {

    @Id
    private String id;

    @Column(name = "assignment_id", nullable = false)
    private String assignmentId;

    @Column(name = "student_id", nullable = false)
    private String studentId;

    @Column(name = "submission_text", columnDefinition = "TEXT")
    private String submissionText;

    @Column(name = "submitted_at")
    private Instant submittedAt;

    @Column(precision = 5, scale = 2)
    private BigDecimal score;

    @Column(name = "graded_by")
    private String gradedBy;

    @Column(columnDefinition = "TEXT")
    private String feedback;

    @Column(length = 32)
    private String status; // SUBMITTED, GRADED, LATE
}
