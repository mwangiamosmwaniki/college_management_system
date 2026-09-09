package ke.college.management.procurement.entity;

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
@Table(name = "purchase_orders")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PurchaseOrder {

    @Id
    private String id;

    @Column(name = "institution_id", nullable = false)
    private String institutionId;

    @Column(name = "po_number", nullable = false, unique = true)
    private String poNumber;

    @Column(name = "requisition_id")
    private String requisitionId;

    @Column(name = "vendor_name", nullable = false)
    private String vendorName;

    @Column(name = "total_amount", nullable = false, precision = 12, scale = 2)
    private BigDecimal totalAmount;

    @Column(length = 32)
    private String status; // ISSUED, FULFILLED, CANCELLED

    @Column(name = "created_at")
    private Instant createdAt;
}
