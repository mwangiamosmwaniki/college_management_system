package ke.college.management.hr.entity;

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
@Table(name = "payroll_batches")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PayrollBatch {

    @Id
    private String id;

    @Column(name = "institution_id", nullable = false)
    private String institutionId;

    @Column(name = "month_year", nullable = false)
    private String monthYear;

    @Column(name = "total_gross", nullable = false, precision = 14, scale = 2)
    private BigDecimal totalGross;

    @Column(name = "total_net", nullable = false, precision = 14, scale = 2)
    private BigDecimal totalNet;

    @Column(length = 32)
    private String status; // DRAFT, APPROVED, DISBURSED

    @Column(name = "processed_by")
    private String processedBy;

    @Column(name = "created_at")
    private Instant createdAt;
}
