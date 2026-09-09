package ke.college.management.finance.entity;

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
@Table(name = "payment_allocations")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentAllocation {

    @Id
    private String id;

    @Column(name = "institution_id", nullable = false)
    private String institutionId;

    @Column(name = "payment_id", nullable = false)
    private String paymentId;

    @Column(name = "invoice_id", nullable = false)
    private String invoiceId;

    @Column(name = "allocated_amount", nullable = false, precision = 12, scale = 2)
    private BigDecimal allocatedAmount;

    @Column(name = "allocated_at", nullable = false)
    private Instant allocatedAt;

    @Column(name = "created_by")
    private String createdBy;
}
