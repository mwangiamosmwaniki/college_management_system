package ke.college.management.procurement;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import ke.college.management.audit.AuditService;
import ke.college.management.common.ApiResponse;
import ke.college.management.exceptions.ResourceNotFoundException;
import ke.college.management.procurement.entity.ProcurementRequisition;
import ke.college.management.procurement.entity.PurchaseOrder;
import ke.college.management.procurement.repository.ProcurementRequisitionRepository;
import ke.college.management.procurement.repository.PurchaseOrderRepository;
import ke.college.management.security.SecurityUtils;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.security.SecureRandom;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/procurement")
@RequiredArgsConstructor
@Tag(name = "Procurement & Inventory", description = "Departmental requisitions, procurement approvals and purchase orders")
public class ProcurementController {

    private final ProcurementRequisitionRepository requisitionRepository;
    private final PurchaseOrderRepository purchaseOrderRepository;
    private final AuditService auditService;

    private final SecureRandom secureRandom = new SecureRandom();

    @GetMapping("/requisitions")
    @Operation(summary = "List institutional procurement requisitions")
    public ApiResponse<List<ProcurementRequisition>> getRequisitions() {
        return ApiResponse.success(requisitionRepository.findByInstitutionId(SecurityUtils.getCurrentInstitutionId()));
    }

    @PostMapping("/requisitions")
    @Operation(summary = "Submit a departmental procurement requisition")
    public ApiResponse<ProcurementRequisition> createRequisition(@RequestBody ProcurementRequisition req) {
        String institutionId = SecurityUtils.getCurrentInstitutionId();
        req.setId("req_" + UUID.randomUUID().toString().replace("-", "").substring(0, 16));
        req.setInstitutionId(institutionId);
        int randomCode = 1000 + secureRandom.nextInt(9000);
        req.setRequisitionNumber("REQ-" + LocalDate.now().getYear() + "-" + randomCode);
        req.setRequestedBy(SecurityUtils.getCurrentUserId());
        req.setStatus("PENDING");
        req.setCreatedAt(Instant.now());

        ProcurementRequisition saved = requisitionRepository.save(req);
        return ApiResponse.success("Requisition submitted", saved);
    }

    @PutMapping("/requisitions/{id}/decision")
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('PROCUREMENT_APPROVE')")
    @Operation(summary = "Approve or reject procurement requisition")
    public ApiResponse<ProcurementRequisition> decideRequisition(
            @PathVariable String id,
            @RequestParam String status
    ) {
        ProcurementRequisition req = requisitionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Requisition not found"));

        req.setStatus(status.toUpperCase());
        req.setApprovedBy(SecurityUtils.getCurrentUserId());
        ProcurementRequisition saved = requisitionRepository.save(req);
        return ApiResponse.success("Requisition " + status, saved);
    }

    @GetMapping("/orders")
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('PROCUREMENT_APPROVE')")
    @Operation(summary = "List purchase orders")
    public ApiResponse<List<PurchaseOrder>> getPurchaseOrders() {
        return ApiResponse.success(purchaseOrderRepository.findByInstitutionId(SecurityUtils.getCurrentInstitutionId()));
    }

    @PostMapping("/orders")
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('PROCUREMENT_APPROVE')")
    @Operation(summary = "Issue a purchase order to vendor")
    public ApiResponse<PurchaseOrder> issuePurchaseOrder(@RequestBody PurchaseOrder order) {
        String institutionId = SecurityUtils.getCurrentInstitutionId();
        order.setId("po_" + UUID.randomUUID().toString().replace("-", "").substring(0, 16));
        order.setInstitutionId(institutionId);
        int randomCode = 1000 + secureRandom.nextInt(9000);
        order.setPoNumber("PO-" + LocalDate.now().getYear() + "-" + randomCode);
        order.setStatus("ISSUED");
        order.setCreatedAt(Instant.now());

        PurchaseOrder saved = purchaseOrderRepository.save(order);
        return ApiResponse.success("Purchase order issued to " + order.getVendorName(), saved);
    }
}
