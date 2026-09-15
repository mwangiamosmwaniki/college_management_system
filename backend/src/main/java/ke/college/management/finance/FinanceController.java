package ke.college.management.finance;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import ke.college.management.common.ApiResponse;
import ke.college.management.common.PageResponse;
import ke.college.management.exceptions.BadRequestException;
import ke.college.management.exceptions.ResourceNotFoundException;
import ke.college.management.exceptions.UnauthorizedException;
import ke.college.management.finance.dto.CreateInvoiceRequest;
import ke.college.management.finance.dto.MpesaTransactionResponseDto;
import ke.college.management.finance.dto.RecordPaymentRequest;
import ke.college.management.finance.entity.FinancialLedger;
import ke.college.management.finance.entity.Invoice;
import ke.college.management.finance.entity.MpesaTransaction;
import ke.college.management.finance.entity.Payment;
import ke.college.management.finance.entity.Receipt;
import ke.college.management.finance.repository.InvoiceRepository;
import ke.college.management.finance.repository.PaymentRepository;
import ke.college.management.security.CustomUserDetails;
import ke.college.management.security.SecurityUtils;
import ke.college.management.students.entity.Student;
import ke.college.management.students.repository.StudentRepository;
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
    private final StudentRepository studentRepository;
    private final PaymentService paymentService;
    private final FinanceReconciliationService reconciliationService;

    private void validateStudentAccess(String studentId) {
        if (studentId == null || studentId.isBlank()) {
            throw new BadRequestException("studentId is required");
        }

        String currentInstitutionId = SecurityUtils.getCurrentInstitutionId();
        Student targetStudent = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found: " + studentId));

        if (!currentInstitutionId.equals(targetStudent.getInstitutionId())) {
            throw new UnauthorizedException("Cross-tenant access denied: Student belongs to a different institution");
        }

        CustomUserDetails currentUser = SecurityUtils.getCurrentUserDetails();
        boolean isStaff = currentUser.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().startsWith("ROLE_ADMIN") ||
                               a.getAuthority().startsWith("ROLE_FINANCE") ||
                               a.getAuthority().equals("FINANCE_VIEW") ||
                               a.getAuthority().equals("FINANCE_MANAGE"));
        if (!isStaff) {
            Student callerStudent = studentRepository.findByInstitutionIdAndUserId(
                    currentInstitutionId, currentUser.getId()
            ).orElseThrow(() -> new UnauthorizedException("IDOR Violation: Student profile not found for account"));
            if (!callerStudent.getId().equals(studentId)) {
                throw new UnauthorizedException("IDOR Violation: Access denied to student finance records");
            }
        }
    }

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

    @GetMapping("/invoices/me")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get fee invoices for currently authenticated student")
    public ApiResponse<List<Invoice>> getMyInvoices() {
        String currentUserId = SecurityUtils.getCurrentUserId();
        String institutionId = SecurityUtils.getCurrentInstitutionId();
        Student student = studentRepository.findByInstitutionIdAndUserId(institutionId, currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));
        return ApiResponse.success(invoiceRepository.findByStudentId(student.getId()));
    }

    @GetMapping("/invoices/student/{studentId}")
    @Operation(summary = "Get fee invoices for student")
    public ApiResponse<List<Invoice>> getStudentInvoices(@PathVariable String studentId) {
        validateStudentAccess(studentId);
        return ApiResponse.success(invoiceRepository.findByStudentId(studentId));
    }

    @GetMapping("/payments/me")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get payment history for currently authenticated student")
    public ApiResponse<List<Payment>> getMyPayments() {
        String currentUserId = SecurityUtils.getCurrentUserId();
        String institutionId = SecurityUtils.getCurrentInstitutionId();
        Student student = studentRepository.findByInstitutionIdAndUserId(institutionId, currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));
        return ApiResponse.success(paymentRepository.findByStudentId(student.getId()));
    }

    @GetMapping("/payments/student/{studentId}")
    @Operation(summary = "Get payment history for student")
    public ApiResponse<List<Payment>> getStudentPayments(@PathVariable String studentId) {
        validateStudentAccess(studentId);
        return ApiResponse.success(paymentRepository.findByStudentId(studentId));
    }

    @GetMapping("/payments/{id}")
    @Operation(summary = "Get single payment record with IDOR validation")
    public ApiResponse<Payment> getPaymentById(@PathVariable String id) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found"));
        SecurityUtils.validateTenantAccess(payment.getInstitutionId());

        CustomUserDetails currentUser = SecurityUtils.getCurrentUserDetails();
        boolean isStaff = currentUser.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().startsWith("ROLE_ADMIN") ||
                               a.getAuthority().startsWith("ROLE_FINANCE"));
        if (!isStaff) {
            Student student = studentRepository.findByInstitutionIdAndUserId(
                    SecurityUtils.getCurrentInstitutionId(), currentUser.getId()
            ).orElseThrow(() -> new UnauthorizedException("IDOR Violation: Student profile not found"));
            if (!student.getId().equals(payment.getStudentId())) {
                throw new UnauthorizedException("IDOR Violation: Access denied to payment record " + id);
            }
        }
        return ApiResponse.success(payment);
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
        validateStudentAccess(studentId);
        return ApiResponse.success(paymentService.getStudentLedger(studentId));
    }

    @GetMapping("/receipts/student/{studentId}")
    @Operation(summary = "Get authoritative receipts for student")
    public ApiResponse<List<Receipt>> getStudentReceipts(@PathVariable String studentId) {
        validateStudentAccess(studentId);
        return ApiResponse.success(paymentService.getStudentReceipts(studentId));
    }

    private MpesaTransactionResponseDto toMpesaDto(MpesaTransaction tx) {
        if (tx == null) return null;
        return MpesaTransactionResponseDto.builder()
                .id(tx.getId())
                .institutionId(tx.getInstitutionId())
                .studentId(tx.getStudentId())
                .invoiceId(tx.getInvoiceId())
                .phoneNumber(tx.getPhoneNumber())
                .amount(tx.getAmount())
                .accountReference(tx.getAccountReference())
                .transactionCode(tx.getTransactionCode())
                .mpesaReceiptNumber(tx.getMpesaReceiptNumber())
                .transactionDate(tx.getTransactionDate())
                .status(tx.getStatus())
                .createdAt(tx.getCreatedAt())
                .build();
    }

    @PostMapping("/payments/mpesa/stk-push")
    @Operation(summary = "Initiate real M-Pesa STK Push payment")
    public ApiResponse<MpesaTransactionResponseDto> initiateMpesaPayment(@RequestBody MpesaInitiateRequest request) {
        String currentInstitutionId = SecurityUtils.getCurrentInstitutionId();
        CustomUserDetails currentUser = SecurityUtils.getCurrentUserDetails();
        boolean isStaff = currentUser.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().startsWith("ROLE_ADMIN") ||
                               a.getAuthority().startsWith("ROLE_FINANCE") ||
                               a.getAuthority().equals("FINANCE_VIEW") ||
                               a.getAuthority().equals("FINANCE_MANAGE"));

        String effectiveStudentId = request.getStudentId();
        if (!isStaff) {
            // For students, authoritatively resolve from identity and disallow tampering
            Student callerStudent = studentRepository.findByInstitutionIdAndUserId(
                    currentInstitutionId, currentUser.getId()
            ).orElseThrow(() -> new UnauthorizedException("Student profile not found for account"));
            if (effectiveStudentId != null && !effectiveStudentId.isBlank() && !callerStudent.getId().equals(effectiveStudentId)) {
                throw new UnauthorizedException("IDOR Violation: Students cannot initiate payments for other student accounts");
            }
            effectiveStudentId = callerStudent.getId();
            request.setStudentId(effectiveStudentId);
        } else {
            if (effectiveStudentId == null || effectiveStudentId.isBlank()) {
                throw new BadRequestException("studentId is required for staff payment initiation");
            }
            validateStudentAccess(effectiveStudentId);
        }

        // Validate invoice tenant and student ownership if invoiceId is supplied
        if (request.getInvoiceId() != null && !request.getInvoiceId().isBlank()) {
            Invoice invoice = invoiceRepository.findById(request.getInvoiceId())
                    .orElseThrow(() -> new ResourceNotFoundException("Invoice not found: " + request.getInvoiceId()));
            if (!currentInstitutionId.equals(invoice.getInstitutionId())) {
                throw new UnauthorizedException("Cross-tenant access denied to invoice");
            }
            if (!invoice.getStudentId().equals(effectiveStudentId)) {
                throw new UnauthorizedException("IDOR Violation: Specified invoice does not belong to the target student");
            }
        }

        MpesaTransaction tx = paymentService.initiateMpesaStkPush(
                effectiveStudentId,
                request.getInvoiceId(),
                request.getPhoneNumber(),
                request.getAmount(),
                request.getAccountReference()
        );
        return ApiResponse.success("M-Pesa payment prompt dispatched to " + tx.getPhoneNumber(), toMpesaDto(tx));
    }

    @GetMapping("/mpesa/{id}")
    @Operation(summary = "Get status of an M-Pesa payment transaction")
    public ApiResponse<MpesaTransactionResponseDto> getMpesaTransaction(@PathVariable String id) {
        MpesaTransaction tx = paymentService.getTransaction(id);
        SecurityUtils.validateTenantAccess(tx.getInstitutionId());

        CustomUserDetails currentUser = SecurityUtils.getCurrentUserDetails();
        boolean isStaff = currentUser.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().startsWith("ROLE_ADMIN") ||
                               a.getAuthority().startsWith("ROLE_FINANCE") ||
                               a.getAuthority().equals("FINANCE_VIEW") ||
                               a.getAuthority().equals("FINANCE_MANAGE"));

        if (tx.getStudentId() != null) {
            validateStudentAccess(tx.getStudentId());
        } else if (!isStaff) {
            throw new UnauthorizedException("Access denied: You are not authorized to view this transaction");
        }
        return ApiResponse.success(toMpesaDto(tx));
    }

    @PostMapping("/payments/mpesa/callback")
    @Operation(summary = "Authoritative M-Pesa Safaricom Daraja Webhook Callback")
    public ApiResponse<Map<String, String>> mpesaCallback(@RequestBody Map<String, Object> callbackData) {
        boolean processed = paymentService.processMpesaCallback(callbackData);
        return ApiResponse.success("Callback processed", Map.of("status", processed ? "ACCEPTED" : "IGNORED"));
    }

    @PostMapping("/mpesa/reconcile-pending")
    @PreAuthorize("hasAuthority('FINANCE_MANAGE') or hasRole('ADMIN')")
    @Operation(summary = "Reconcile pending M-Pesa transactions against Safaricom Daraja gateway")
    public ApiResponse<Map<String, Object>> reconcilePendingMpesa() {
        int count = paymentService.reconcilePendingMpesaTransactions();
        return ApiResponse.success("Pending M-Pesa transactions reconciled", Map.of("reconciledCount", count));
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
