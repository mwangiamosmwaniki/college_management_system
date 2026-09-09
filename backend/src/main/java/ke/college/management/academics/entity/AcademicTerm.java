package ke.college.management.academics.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name = "academic_terms")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AcademicTerm {

    @Id
    @Column(length = 64)
    private String id;

    @Column(name = "academic_year_id", nullable = false, length = 64)
    private String academicYearId;

    @Column(name = "institution_id", nullable = false, length = 64)
    private String institutionId;

    @Column(name = "term_name", nullable = false, length = 64)
    private String termName;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Column(length = 32)
    @Builder.Default
    private String status = "UPCOMING";

    @Column(name = "is_active")
    @Builder.Default
    private Boolean isActive = false;

    @Column(name = "created_at")
    @Builder.Default
    private Instant createdAt = Instant.now();
}
