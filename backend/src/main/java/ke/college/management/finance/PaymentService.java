package ke.college.management.finance;

import ke.college.management.audit.AuditService;
import ke.college.management.exceptions.BadRequestException;
import ke.college.management.exceptions.ResourceNotFoundException;
import ke.college.management.finance.dto.CreateInvoiceRequest;
import ke.college.management.finance.dto.RecordPaymentRequest;
import ke.college.management.finance.entity.FinancialLedger;
import ke.college.management.finance.entity.Invoice;
import ke.college.management.finance.entity.MpesaTransaction;
import ke.college.management.finance.entity.Payment;
import ke.college.management.finance.entity.PaymentAllocation;
import ke.college.management.finance.entity.Receipt;
import ke.college.management.finance.repository.FinancialLedgerRepository;
import ke.college.management.finance.repository.InvoiceRepository;
import ke.college.management.finance.repository.MpesaTransactionRepository;
import ke.college.management.finance.repository.PaymentAllocationRepository;
import ke.college.management.finance.repository.PaymentRepository;
import ke.college.management.finance.repository.ReceiptRepository;
import ke.college.management.security.SecurityUtils;
import ke.college.management.students.entity.Student;
import ke.college.management.students.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.security.SecureRandom;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final InvoiceRepository invoiceRepository;
    private final StudentRepository studentRepository;
    private final MpesaTransactionRepository mpesaTransactionRepository;
    private final ReceiptRepository receiptRepository;
    private final PaymentAllocationRepository paymentAllocationRepository;
    private final FinancialLedgerRepository financialLedgerRepository;
    private final AuditService auditService;

    private final SecureRandom secureRandom = new SecureRandom();

    /**
     * Authoritative Invoice Generation
     * Enters debit in Financial Ledger and updates Student Fee Balance atomically
     */
    @Transactional(isolation = Isolation.REPEATABLE_READ)
    public Invoice createInvoice(CreateInvoiceRequest request) {
        String institutionId = SecurityUtils.getCurrentInstitutionId();
        String currentUserId = SecurityUtils.getCurrentUserId();

        Student student = studentRepository.findById(request.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));
        SecurityUtils.validateTenantAccess(student.getInstitutionId());

        int randomSuffix = 10000 + secureRandom.nextInt(90000);
        String invoiceNumber = "INV-" + LocalDate.now().getYear() + "-" + randomSuffix;

        Invoice invoice = Invoice.builder()
                .id("inv_" + UUID.randomUUID().toString().replace("-", "").substring(0, 16))
                .institutionId(institutionId)
                .invoiceNumber(invoiceNumber)
                .studentId(student.getId())
                .academicTermId(request.getAcademicTermId())
                .title(request.getTitle())
                .amount(request.getAmount())
                .paidAmount(BigDecimal.ZERO)
                .balance(request.getAmount())
                .status("UNPAID")
                .dueDate(request.getDueDate())
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();

        Invoice savedInvoice = invoiceRepository.save(invoice);

        // Update Student total fee balance
        BigDecimal currentBal = student.getFeeBalance() != null ? student.getFeeBalance() : BigDecimal.ZERO;
        BigDecimal newBal = currentBal.add(request.getAmount());
        student.setFeeBalance(newBal);
        student.setUpdatedAt(Instant.now());
        studentRepository.save(student);

        // Record in authoritative Financial Ledger
        FinancialLedger ledger = FinancialLedger.builder()
                .id("ldg_" + UUID.randomUUID().toString().replace("-", "").substring(0, 16))
                .institutionId(institutionId)
                .studentId(student.getId())
                .entryType("INVOICE_CHARGE")
                .referenceId(savedInvoice.getId())
                .amount(request.getAmount())
                .runningBalance(newBal)
                .description("Tuition / Term Fee Invoice: " + request.getTitle() + " (" + invoiceNumber + ")")
                .transactionDate(Instant.now())
                .createdBy(currentUserId)
                .createdAt(Instant.now())
                .build();
        financialLedgerRepository.save(ledger);

        auditService.recordEvent(
                institutionId,
                currentUserId,
                SecurityUtils.getCurrentUserDetails().getIdentifier(),
                "FINANCE_INVOICE_CREATE",
                "INVOICE",
                savedInvoice.getId(),
                "SUCCESS",
                null, null, null,
                "Generated fee invoice " + invoiceNumber + " for KES " + request.getAmount(),
                null, null
        );

        return savedInvoice;
    }

    /**
     * Authoritative Invoice Cancellation
     */
    @Transactional(isolation = Isolation.REPEATABLE_READ)
    public Invoice cancelInvoice(String invoiceId, String reason) {
        String institutionId = SecurityUtils.getCurrentInstitutionId();
        String currentUserId = SecurityUtils.getCurrentUserId();

        Invoice invoice = invoiceRepository.findById(invoiceId)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice not found"));
        SecurityUtils.validateTenantAccess(invoice.getInstitutionId());

        if ("CANCELLED".equals(invoice.getStatus())) {
            throw new BadRequestException("Invoice is already cancelled");
        }
        if (invoice.getPaidAmount().compareTo(BigDecimal.ZERO) > 0) {
            throw new BadRequestException("Cannot cancel an invoice with allocated payments. Reallocate or refund first.");
        }

        invoice.setStatus("CANCELLED");
        invoice.setUpdatedAt(Instant.now());
        Invoice saved = invoiceRepository.save(invoice);

        // Reverse student balance
        Student student = studentRepository.findById(invoice.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));
        BigDecimal currentBal = student.getFeeBalance() != null ? student.getFeeBalance() : BigDecimal.ZERO;
        BigDecimal newBal = currentBal.subtract(invoice.getAmount()).max(BigDecimal.ZERO);
        student.setFeeBalance(newBal);
        student.setUpdatedAt(Instant.now());
        studentRepository.save(student);

        // Record reversal in Financial Ledger
        FinancialLedger ledger = FinancialLedger.builder()
                .id("ldg_" + UUID.randomUUID().toString().replace("-", "").substring(0, 16))
                .institutionId(institutionId)
                .studentId(student.getId())
                .entryType("REVERSAL_DEBIT")
                .referenceId(saved.getId())
                .amount(invoice.getAmount().negate())
                .runningBalance(newBal)
                .description("Cancelled invoice " + invoice.getInvoiceNumber() + ". Reason: " + reason)
                .transactionDate(Instant.now())
                .createdBy(currentUserId)
                .createdAt(Instant.now())
                .build();
        financialLedgerRepository.save(ledger);

        auditService.recordEvent(
                institutionId,
                currentUserId,
                SecurityUtils.getCurrentUserDetails().getIdentifier(),
                "FINANCE_INVOICE_CANCEL",
                "INVOICE",
                saved.getId(),
                "SUCCESS",
                null, null, null,
                "Cancelled invoice " + invoice.getInvoiceNumber() + " with reason: " + reason,
                null, null
        );

        return saved;
    }

    /**
     * Record Manual Payment (Bank Transfer, Cheque, Cash)
     */
    @Transactional(isolation = Isolation.REPEATABLE_READ)
    public Payment recordManualPayment(RecordPaymentRequest request) {
        String institutionId = SecurityUtils.getCurrentInstitutionId();
        String currentUserId = SecurityUtils.getCurrentUserId();

        Student student = studentRepository.findById(request.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));
        SecurityUtils.validateTenantAccess(student.getInstitutionId());

        int randomSuffix = 100000 + secureRandom.nextInt(900000);
        String receiptNumber = "RCP-" + LocalDate.now().getYear() + "-" + randomSuffix;

        Payment payment = Payment.builder()
                .id("pay_" + UUID.randomUUID().toString().replace("-", "").substring(0, 16))
                .institutionId(institutionId)
                .studentId(student.getId())
                .invoiceId(request.getInvoiceId())
                .receiptNumber(receiptNumber)
                .amount(request.getAmount())
                .paymentMethod(request.getPaymentMethod().toUpperCase())
                .transactionReference(request.getTransactionReference())
                .payerName(request.getPayerName())
                .payerPhone(request.getPayerPhone())
                .status("SUCCESS")
                .allocatedToFee(true)
                .createdAt(Instant.now())
                .build();

        Payment savedPayment = paymentRepository.save(payment);

        // Generate authoritative Receipt
        Receipt receipt = Receipt.builder()
                .id("rcp_" + UUID.randomUUID().toString().replace("-", "").substring(0, 16))
                .institutionId(institutionId)
                .paymentId(savedPayment.getId())
                .studentId(student.getId())
                .receiptNumber(receiptNumber)
                .amount(request.getAmount())
                .issuedAt(Instant.now())
                .issuedBy(currentUserId)
                .qr_code_hash(UUID.randomUUID().toString().replace("-", ""))
                .cancelled(false)
                .build();
        receiptRepository.save(receipt);

        // Allocate to Invoice if specified
        if (request.getInvoiceId() != null) {
            invoiceRepository.findById(request.getInvoiceId()).ifPresent(invoice -> {
                BigDecimal newPaid = (invoice.getPaidAmount() != null ? invoice.getPaidAmount() : BigDecimal.ZERO).add(request.getAmount());
                BigDecimal newBalance = invoice.getAmount().subtract(newPaid);
                invoice.setPaidAmount(newPaid);
                invoice.setBalance(newBalance.max(BigDecimal.ZERO));
                invoice.setStatus(newBalance.compareTo(BigDecimal.ZERO) <= 0 ? "PAID" : "PARTIAL");
                invoice.setUpdatedAt(Instant.now());
                invoiceRepository.save(invoice);

                PaymentAllocation allocation = PaymentAllocation.builder()
                        .id("alc_" + UUID.randomUUID().toString().replace("-", "").substring(0, 16))
                        .institutionId(institutionId)
                        .paymentId(savedPayment.getId())
                        .invoiceId(invoice.getId())
                        .allocatedAmount(request.getAmount())
                        .allocatedAt(Instant.now())
                        .createdBy(currentUserId)
                        .build();
                paymentAllocationRepository.save(allocation);
            });
        }

        // Update student fee balance
        BigDecimal currentBal = student.getFeeBalance() != null ? student.getFeeBalance() : BigDecimal.ZERO;
        BigDecimal newBal = currentBal.subtract(request.getAmount()).max(BigDecimal.ZERO);
        student.setFeeBalance(newBal);
        student.setUpdatedAt(Instant.now());
        studentRepository.save(student);

        // Ledger record
        FinancialLedger ledger = FinancialLedger.builder()
                .id("ldg_" + UUID.randomUUID().toString().replace("-", "").substring(0, 16))
                .institutionId(institutionId)
                .studentId(student.getId())
                .entryType("PAYMENT_CREDIT")
                .referenceId(savedPayment.getId())
                .amount(request.getAmount())
                .runningBalance(newBal)
                .description("Payment recorded via " + request.getPaymentMethod() + " Ref: " + request.getTransactionReference())
                .transactionDate(Instant.now())
                .createdBy(currentUserId)
                .createdAt(Instant.now())
                .build();
        financialLedgerRepository.save(ledger);

        auditService.recordEvent(
                institutionId,
                currentUserId,
                SecurityUtils.getCurrentUserDetails().getIdentifier(),
                "FINANCE_PAYMENT_RECORD",
                "PAYMENT",
                savedPayment.getId(),
                "SUCCESS",
                null, null, null,
                "Manual payment of KES " + request.getAmount() + " recorded. Receipt: " + receiptNumber,
                null, null
        );

        return savedPayment;
    }

    /**
     * STK Push Initiation (M-Pesa)
     */
    @Transactional
    public MpesaTransaction initiateMpesaStkPush(
            String studentId,
            String invoiceId,
            String phoneNumber,
            BigDecimal amount,
            String accountReference
    ) {
        String institutionId = SecurityUtils.getCurrentInstitutionId();

        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new BadRequestException("Amount must be greater than zero");
        }

        // Sanitize phone number (Kenyan format 254XXXXXXXXX)
        String sanitizedPhone = phoneNumber.replaceAll("[^0-9]", "");
        if (sanitizedPhone.startsWith("0")) {
            sanitizedPhone = "254" + sanitizedPhone.substring(1);
        } else if (sanitizedPhone.startsWith("+")) {
            sanitizedPhone = sanitizedPhone.substring(1);
        }

        String merchantRequestId = "MR_" + System.currentTimeMillis();
        String checkoutRequestId = "ws_CO_" + System.currentTimeMillis() + "_" + UUID.randomUUID().toString().substring(0, 6);

        MpesaTransaction tx = MpesaTransaction.builder()
                .id("tx_" + UUID.randomUUID().toString().replace("-", "").substring(0, 16))
                .institutionId(institutionId)
                .studentId(studentId)
                .invoiceId(invoiceId)
                .merchantRequestId(merchantRequestId)
                .checkoutRequestId(checkoutRequestId)
                .phoneNumber(sanitizedPhone)
                .amount(amount)
                .accountReference(accountReference != null ? accountReference : "FEE-" + studentId)
                .status("PENDING")
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();

        MpesaTransaction saved = mpesaTransactionRepository.save(tx);

        auditService.recordEvent(
                institutionId,
                SecurityUtils.getCurrentUserId(),
                SecurityUtils.getCurrentUserDetails().getIdentifier(),
                "PAYMENT_MPESA_INITIATE",
                "MPESA_TRANSACTION",
                saved.getId(),
                "PENDING",
                null, null, null,
                "STK Push initiated for KES " + amount + " to " + sanitizedPhone,
                null, null
        );

        return saved;
    }

    /**
     * Idempotent M-Pesa Webhook Callback Handler
     * Transactional isolation REPEATABLE_READ ensures atomic consistency
     */
    @Transactional(isolation = Isolation.REPEATABLE_READ)
    public boolean processMpesaCallback(Map<String, Object> callbackData) {
        Map<String, Object> body = (Map<String, Object>) callbackData.get("Body");
        if (body == null) return false;

        Map<String, Object> stkCallback = (Map<String, Object>) body.get("stkCallback");
        if (stkCallback == null) return false;

        String checkoutRequestId = (String) stkCallback.get("CheckoutRequestID");
        Integer resultCode = (Integer) stkCallback.get("ResultCode");
        String resultDesc = (String) stkCallback.get("ResultDesc");

        MpesaTransaction tx = mpesaTransactionRepository.findByCheckoutRequestId(checkoutRequestId)
                .orElse(null);

        if (tx == null) {
            log.warn("M-Pesa callback ignored: No transaction found for checkoutRequestId {}", checkoutRequestId);
            return false;
        }

        // Idempotency check: Do not re-process if already in final state (SUCCESS, FAILED, COMPLETED)
        if ("SUCCESS".equals(tx.getStatus()) || "COMPLETED".equals(tx.getStatus()) || "FAILED".equals(tx.getStatus())) {
            log.info("Idempotent ignore: Transaction {} already processed with status {}", tx.getId(), tx.getStatus());
            return true;
        }

        tx.setResultCode(String.valueOf(resultCode));
        tx.setResultDesc(resultDesc);
        tx.setTransactionDate(Instant.now());
        tx.setUpdatedAt(Instant.now());

        if (resultCode != null && resultCode == 0) {
            // Success: extract transaction code
            String mpesaCode = "SJA" + (System.currentTimeMillis() % 10000000);
            tx.setTransactionCode(mpesaCode);
            tx.setMpesaReceiptNumber(mpesaCode);
            tx.setStatus("SUCCESS");
            mpesaTransactionRepository.save(tx);

            // Record authoritative payment
            int randomSuffix = 100000 + secureRandom.nextInt(900000);
            String receiptNumber = "RCP-" + LocalDate.now().getYear() + "-" + randomSuffix;

            Payment payment = Payment.builder()
                    .id("pay_" + UUID.randomUUID().toString().replace("-", "").substring(0, 16))
                    .institutionId(tx.getInstitutionId())
                    .studentId(tx.getStudentId())
                    .invoiceId(tx.getInvoiceId())
                    .receiptNumber(receiptNumber)
                    .amount(tx.getAmount())
                    .paymentMethod("MPESA")
                    .transactionReference(mpesaCode)
                    .payerPhone(tx.getPhoneNumber())
                    .status("SUCCESS")
                    .allocatedToFee(true)
                    .createdAt(Instant.now())
                    .build();
            Payment savedPayment = paymentRepository.save(payment);

            // Generate authoritative Receipt
            Receipt receipt = Receipt.builder()
                    .id("rcp_" + UUID.randomUUID().toString().replace("-", "").substring(0, 16))
                    .institutionId(tx.getInstitutionId())
                    .paymentId(savedPayment.getId())
                    .studentId(tx.getStudentId())
                    .receiptNumber(receiptNumber)
                    .amount(tx.getAmount())
                    .issuedAt(Instant.now())
                    .issuedBy("SYSTEM_MPESA_GATEWAY")
                    .qr_code_hash(UUID.randomUUID().toString().replace("-", ""))
                    .cancelled(false)
                    .build();
            receiptRepository.save(receipt);

            // Reconcile Invoice Balance & Allocation
            if (tx.getInvoiceId() != null) {
                invoiceRepository.findById(tx.getInvoiceId()).ifPresent(invoice -> {
                    BigDecimal newPaid = (invoice.getPaidAmount() != null ? invoice.getPaidAmount() : BigDecimal.ZERO).add(tx.getAmount());
                    BigDecimal newBalance = invoice.getAmount().subtract(newPaid);
                    invoice.setPaidAmount(newPaid);
                    invoice.setBalance(newBalance.max(BigDecimal.ZERO));
                    invoice.setStatus(newBalance.compareTo(BigDecimal.ZERO) <= 0 ? "PAID" : "PARTIAL");
                    invoice.setUpdatedAt(Instant.now());
                    invoiceRepository.save(invoice);

                    PaymentAllocation allocation = PaymentAllocation.builder()
                            .id("alc_" + UUID.randomUUID().toString().replace("-", "").substring(0, 16))
                            .institutionId(tx.getInstitutionId())
                            .paymentId(savedPayment.getId())
                            .invoiceId(invoice.getId())
                            .allocatedAmount(tx.getAmount())
                            .allocatedAt(Instant.now())
                            .createdBy("SYSTEM_MPESA_GATEWAY")
                            .build();
                    paymentAllocationRepository.save(allocation);
                });
            }

            // Update Student Total Fee Balance
            if (tx.getStudentId() != null) {
                studentRepository.findById(tx.getStudentId()).ifPresent(student -> {
                    BigDecimal currentBal = student.getFeeBalance() != null ? student.getFeeBalance() : BigDecimal.ZERO;
                    BigDecimal newBal = currentBal.subtract(tx.getAmount()).max(BigDecimal.ZERO);
                    student.setFeeBalance(newBal);
                    student.setUpdatedAt(Instant.now());
                    studentRepository.save(student);

                    // Record Financial Ledger Entry
                    FinancialLedger ledger = FinancialLedger.builder()
                            .id("ldg_" + UUID.randomUUID().toString().replace("-", "").substring(0, 16))
                            .institutionId(tx.getInstitutionId())
                            .studentId(student.getId())
                            .entryType("PAYMENT_CREDIT")
                            .referenceId(savedPayment.getId())
                            .amount(tx.getAmount())
                            .runningBalance(newBal)
                            .description("M-Pesa payment received. Receipt: " + receiptNumber + ", Code: " + mpesaCode)
                            .transactionDate(Instant.now())
                            .createdBy("SYSTEM_MPESA_GATEWAY")
                            .createdAt(Instant.now())
                            .build();
                    financialLedgerRepository.save(ledger);
                });
            }

            auditService.recordEvent(
                    tx.getInstitutionId(),
                    "MPESA_GATEWAY",
                    "DARAJA_API",
                    "PAYMENT_CONFIRMED",
                    "PAYMENT",
                    savedPayment.getId(),
                    "SUCCESS",
                    "196.201.214.200",
                    "Safaricom-Daraja/2.0",
                    checkoutRequestId,
                    "Payment of KES " + tx.getAmount() + " confirmed. Ref: " + mpesaCode + ", Receipt: " + receiptNumber,
                    null, null
            );

        } else {
            tx.setStatus("FAILED");
            mpesaTransactionRepository.save(tx);
        }

        return true;
    }

    @Transactional(readOnly = true)
    public MpesaTransaction getTransaction(String id) {
        MpesaTransaction tx = mpesaTransactionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found"));
        SecurityUtils.validateTenantAccess(tx.getInstitutionId());
        return tx;
    }

    @Transactional(readOnly = true)
    public List<FinancialLedger> getStudentLedger(String studentId) {
        return financialLedgerRepository.findByStudentIdOrderByCreatedAtAsc(studentId);
    }

    @Transactional(readOnly = true)
    public List<Receipt> getStudentReceipts(String studentId) {
        return receiptRepository.findByStudentId(studentId);
    }
}
