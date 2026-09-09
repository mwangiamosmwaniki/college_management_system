package ke.college.management.finance;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import ke.college.management.common.ApiResponse;
import ke.college.management.common.PageResponse;
import ke.college.management.finance.dto.CreateInvoiceRequest;
import ke.college.management.finance.dto.RecordPaymentRequest;
import ke.college.management.finance.entity.FinancialLedger;
import ke.college.management.finance.entity.Invoice;
import ke.college.management.finance.entity.MpesaTransaction;
import ke.college.management.finance.entity.Payment;
import ke.college.management.finance.entity.Receipt;
import ke.college.management.finance.repository.InvoiceRepository;
import ke.college.management.finance.repository.PaymentRepository;
import ke.college.management.security.SecurityUtils;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/finance")
@RequiredArgsConstructor
@Tag(name = "Finance & Bursary", description = "Server-controlled student invoicing, payments, ledger, and M-Pesa gateway reconciliation")
public class FinanceController {

    private final InvoiceRepository invoiceRepository;
    private final PaymentRepository paymentRepository;
    private final PaymentService paymentService;
    private final FinanceReconciliationService reconciliationService;

    @GetMapping("/invoices")
    @PreAuthorize("hasAuthority('FINANCE_VIEW') or hasRole('ADMIN')")
    @Operation(summary = "Get paginated institutional fee invoices")
    public ApiResponse<PageResponse<Invoice>> getInvoices(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        String institutionId = SecurityUtils.getCurrentInstitutionId();
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Invoice> invoicePage = invoiceRepository.findByInstitutionId(institutionId, pageRequest);
        return ApiResponse.success(PageResponse.from(invoicePage));
    }

    @PostMapping("/invoices")
    @PreAuthorize("hasAuthority('FINANCE_MANAGE') or hasRole('ADMIN')")
    @Operation(summary = "Authoritatively generate fee invoice and post to financial ledger")
    public ApiResponse<Invoice> createInvoice(@Valid @RequestBody CreateInvoiceRequest request) {
        Invoice invoice = paymentService.createInvoice(request);
        return ApiResponse.success("Invoice generated successfully", invoice);
    }

    @PostMapping("/invoices/{id}/cancel")
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('FINANCE_MANAGE')")
    @Operation(summary = "Cancel unpaid invoice and reverse fee charges in ledger")
    public ApiResponse<Invoice> cancelInvoice(@PathVariable String id, @RequestParam(defaultValue = "Administrative cancellation") String reason) {
        Invoice invoice = paymentService.cancelInvoice(id, reason);
        return ApiResponse.success("Invoice cancelled and fee charges reversed", invoice);
    }

    @GetMapping("/invoices/student/{studentId}")
    @Operation(summary = "Get fee invoices for student")
    public ApiResponse<List<Invoice>> getStudentInvoices(@PathVariable String studentId) {
        return ApiResponse.success(invoiceRepository.findByStudentId(studentId));
    }

    @GetMapping("/payments/student/{studentId}")
    @Operation(summary = "Get payment history for student")
    public ApiResponse<List<Payment>> getStudentPayments(@PathVariable String studentId) {
        return ApiResponse.success(paymentRepository.findByStudentId(studentId));
    }

    @PostMapping("/payments/record-manual")
    @PreAuthorize("hasAuthority('FINANCE_MANAGE') or hasRole('ADMIN')")
    @Operation(summary = "Record verified manual payment (Bank transfer, cheque, cash)")
    public ApiResponse<Payment> recordManualPayment(@Valid @RequestBody RecordPaymentRequest request) {
        Payment payment = paymentService.recordManualPayment(request);
        return ApiResponse.success("Payment recorded and receipt generated", payment);
    }

    @GetMapping("/ledger/student/{studentId}")
    @Operation(summary = "Get immutable accounting ledger entries for student")
    public ApiResponse<List<FinancialLedger>> getStudentLedger(@PathVariable String studentId) {
        return ApiResponse.success(paymentService.getStudentLedger(studentId));
    }

    @GetMapping("/receipts/student/{studentId}")
    @Operation(summary = "Get authoritative receipts for student")
    public ApiResponse<List<Receipt>> getStudentReceipts(@PathVariable String studentId) {
        return ApiResponse.success(paymentService.getStudentReceipts(studentId));
    }

    @PostMapping("/payments/mpesa/stk-push")
    @Operation(summary = "Initiate real M-Pesa STK Push payment")
    public ApiResponse<MpesaTransaction> initiateMpesaPayment(@RequestBody MpesaInitiateRequest request) {
        MpesaTransaction tx = paymentService.initiateMpesaStkPush(
                request.getStudentId(),
                request.getInvoiceId(),
                request.getPhoneNumber(),
                request.getAmount(),
                request.getAccountReference()
        );
        return ApiResponse.success("M-Pesa payment prompt dispatched to " + tx.getPhoneNumber(), tx);
    }

    @GetMapping("/mpesa/{id}")
    @Operation(summary = "Get status of an M-Pesa payment transaction")
    public ApiResponse<MpesaTransaction> getMpesaTransaction(@PathVariable String id) {
        MpesaTransaction tx = paymentService.getTransaction(id);
        return ApiResponse.success(tx);
    }

    @PostMapping("/payments/mpesa/callback")
    @Operation(summary = "Authoritative M-Pesa Safaricom Daraja Webhook Callback")
    public ApiResponse<Map<String, String>> mpesaCallback(@RequestBody Map<String, Object> callbackData) {
        boolean processed = paymentService.processMpesaCallback(callbackData);
        return ApiResponse.success("Callback processed", Map.of("status", processed ? "ACCEPTED" : "IGNORED"));
    }

    @PostMapping("/reconciliation/run")
    @PreAuthorize("hasAuthority('FINANCE_MANAGE') or hasRole('ADMIN')")
    @Operation(summary = "Run authoritative financial reconciliation and audit discrepancy report")
    public ApiResponse<FinanceReconciliationService.ReconciliationReport> runReconciliation() {
        String institutionId = SecurityUtils.getCurrentInstitutionId();
        FinanceReconciliationService.ReconciliationReport report = reconciliationService.runReconciliation(institutionId);
        return ApiResponse.success("Financial reconciliation completed", report);
    }

    @GetMapping("/reconciliation/report")
    @PreAuthorize("hasAuthority('FINANCE_VIEW') or hasRole('ADMIN')")
    @Operation(summary = "Fetch current financial reconciliation report")
    public ApiResponse<FinanceReconciliationService.ReconciliationReport> getReconciliationReport() {
        String institutionId = SecurityUtils.getCurrentInstitutionId();
        FinanceReconciliationService.ReconciliationReport report = reconciliationService.runReconciliation(institutionId);
        return ApiResponse.success(report);
    }

    @Data
    public static class MpesaInitiateRequest {
        private String studentId;
        private String invoiceId;
        private String phoneNumber;
        private BigDecimal amount;
        private String accountReference;
    }
}
