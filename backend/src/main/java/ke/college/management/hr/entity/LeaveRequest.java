package ke.college.management.hr.entity;

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
@Table(name = "leave_requests")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LeaveRequest {

    @Id
    private String id;

    @Column(name = "institution_id", nullable = false)
    private String institutionId;

    @Column(name = "employee_id", nullable = false)
    private String employeeId;

    @Column(name = "leave_type", nullable = false)
    private String leaveType; // ANNUAL, SICK, MATERNITY, PATERNITY, COMPASSIONATE

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Column(length = 32)
    private String status; // PENDING, APPROVED, REJECTED

    @Column(name = "reviewed_by")
    private String reviewedBy;

    @Column(name = "created_at")
    private Instant createdAt;
}
