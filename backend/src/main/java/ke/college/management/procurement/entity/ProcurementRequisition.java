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
@Table(name = "procurement_requisitions")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProcurementRequisition {

    @Id
    private String id;

    @Column(name = "institution_id", nullable = false)
    private String institutionId;

    @Column(name = "requisition_number", nullable = false, unique = true)
    private String requisitionNumber;

    @Column(name = "department_id")
    private String departmentId;

    @Column(name = "requested_by", nullable = false)
    private String requestedBy;

    @Column(name = "item_description", nullable = false, columnDefinition = "TEXT")
    private String itemDescription;

    @Column(name = "estimated_cost", nullable = false, precision = 12, scale = 2)
    private BigDecimal estimatedCost;

    @Column(length = 32)
    private String status; // PENDING, APPROVED, REJECTED, PO_ISSUED

    @Column(name = "approved_by")
    private String approvedBy;

    @Column(name = "created_at")
    private Instant createdAt;
}
