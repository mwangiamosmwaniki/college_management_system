package ke.college.management.admissions.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.Instant;

@Entity
@Table(name = "admission_sequences")
@IdClass(AdmissionSequence.AdmissionSequenceId.class)
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdmissionSequence {

    @Id
    @Column(name = "institution_id", length = 64)
    private String institutionId;

    @Id
    @Column(name = "academic_year")
    private Integer academicYear;

    @Column(name = "last_value", nullable = false)
    @Builder.Default
    private Long lastValue = 0L;

    @Column(name = "created_at", updatable = false)
    @Builder.Default
    private Instant createdAt = Instant.now();

    @Column(name = "updated_at")
    @Builder.Default
    private Instant updatedAt = Instant.now();

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AdmissionSequenceId implements Serializable {
        private String institutionId;
        private Integer academicYear;
    }
}
