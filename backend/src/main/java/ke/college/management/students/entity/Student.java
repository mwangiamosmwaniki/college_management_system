package ke.college.management.students.entity;

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
import java.time.LocalDate;

@Entity
@Table(name = "students")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Student {

    @Id
    @Column(length = 64)
    private String id;

    @Column(name = "user_id", length = 64)
    private String userId;

    @Column(name = "institution_id", nullable = false, length = 64)
    private String institutionId;

    @Column(name = "campus_id", nullable = false, length = 64)
    private String campusId;

    @Column(name = "program_id", nullable = false, length = 64)
    private String programId;

    @Column(name = "admission_number", nullable = false, length = 64)
    private String admissionNumber;

    @Column(name = "full_name", nullable = false, length = 255)
    private String fullName;

    @Column(length = 16)
    private String gender;

    @Column(name = "national_id", length = 64)
    private String nationalId;

    @Column(name = "birth_date")
    private LocalDate birthDate;

    @Column(name = "phone_number", length = 32)
    private String phoneNumber;

    @Column(length = 255)
    private String email;

    @Column(name = "guardian_name", length = 255)
    private String guardianName;

    @Column(name = "guardian_phone", length = 32)
    private String guardianPhone;

    @Column(name = "current_term_id", length = 64)
    private String currentTermId;

    @Column(length = 32)
    @Builder.Default
    private String status = "ACTIVE";

    @Column(name = "fee_balance")
    @Builder.Default
    private BigDecimal feeBalance = BigDecimal.ZERO;

    @Column(name = "created_at", updatable = false)
    @Builder.Default
    private Instant createdAt = Instant.now();

    @Column(name = "updated_at")
    @Builder.Default
    private Instant updatedAt = Instant.now();

    @Version
    private Long version;
}
