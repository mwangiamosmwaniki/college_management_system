package ke.college.management.academics.entity;

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
@Table(name = "assessments")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Assessment {

    @Id
    @Column(length = 64)
    private String id;

    @Column(name = "course_id", nullable = false, length = 64)
    private String courseId;

    @Column(name = "academic_term_id", nullable = false, length = 64)
    private String academicTermId;

    @Column(nullable = false, length = 128)
    private String title;

    @Column(nullable = false, length = 32)
    private String type; // CAT_1, CAT_2, PRACTICAL, MAIN_EXAM

    @Column(name = "max_marks", nullable = false)
    @Builder.Default
    private BigDecimal maxMarks = new BigDecimal("30.00");

    @Column(name = "weight_percentage", nullable = false)
    @Builder.Default
    private BigDecimal weightPercentage = new BigDecimal("30.00");

    @Column(name = "created_at", updatable = false)
    @Builder.Default
    private Instant createdAt = Instant.now();
}
