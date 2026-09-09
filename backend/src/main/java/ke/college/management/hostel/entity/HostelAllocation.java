package ke.college.management.hostel.entity;

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
@Table(name = "hostel_allocations")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HostelAllocation {

    @Id
    private String id;

    @Column(name = "institution_id", nullable = false)
    private String institutionId;

    @Column(name = "bed_id", nullable = false)
    private String bedId;

    @Column(name = "student_id", nullable = false)
    private String studentId;

    @Column(name = "academic_term_id", nullable = false)
    private String academicTermId;

    @Column(length = 32)
    private String status; // ACTIVE, CHECKED_OUT, CANCELLED

    @Column(name = "allocated_at")
    private Instant allocatedAt;

    @Column(name = "checked_in_at")
    private Instant checkedInAt;

    @Column(name = "checked_out_at")
    private Instant checkedOutAt;
}
