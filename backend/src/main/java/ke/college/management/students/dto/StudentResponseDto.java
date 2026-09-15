package ke.college.management.students.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

/**
 * Public/Portal Data Transfer Object for Student profiles.
 * Explicitly omits sensitive private identifiers such as nationalId,
 * internal user account IDs, security metadata, and versioning attributes.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentResponseDto {
    private String id;
    private String admissionNumber;
    private String fullName;
    private String campusId;
    private String programId;
    private String currentTermId;
    private String gender;
    private LocalDate birthDate;
    private String phoneNumber;
    private String email;
    private String guardianName;
    private String guardianPhone;
    private String status;
    private BigDecimal feeBalance;
    private Instant createdAt;
}
