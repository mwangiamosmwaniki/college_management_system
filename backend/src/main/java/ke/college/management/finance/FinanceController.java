package ke.college.management.finance;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import ke.college.management.common.ApiResponse;
import ke.college.management.common.PageResponse;
import ke.college.management.exceptions.ResourceNotFoundException;
import ke.college.management.finance.entity.Invoice;
import ke.college.management.finance.entity.MpesaTransaction;
import ke.college.management.finance.entity.Payment;
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
@Tag(name = "Finance & Bursary", description = "Server-controlled student invoicing, payments, and M-Pesa gateway reconciliation")
public class FinanceController {

    private final InvoiceRepository invoiceRepository;
    private final PaymentRepository paymentRepository;
    private final PaymentService paymentService;

    @GetMapping("/invoices")
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

    @GetMapping("/invoices/student/{studentId}")
    @Operation(summary = "Get fee invoices for student")
    public ApiResponse<List<Invoice>> getStudentInvoices(@PathVariable String studentId) {
        return ApiResponse.success(invoiceRepository.findByStudentId(studentId));
    }

    @GetMapping("/payments/student/{studentId}")
    @Operation(summary = "Get payment history and receipts for student")
    public ApiResponse<List<Payment>> getStudentPayments(@PathVariable String studentId) {
        return ApiResponse.success(paymentRepository.findByStudentId(studentId));
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

    @PostMapping("/payments/mpesa/callback")
    @Operation(summary = "Authoritative M-Pesa Safaricom Daraja Webhook Callback")
    public ApiResponse<Map<String, String>> mpesaCallback(@RequestBody Map<String, Object> callbackData) {
        boolean processed = paymentService.processMpesaCallback(callbackData);
        return ApiResponse.success("Callback processed", Map.of("status", processed ? "ACCEPTED" : "IGNORED"));
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
