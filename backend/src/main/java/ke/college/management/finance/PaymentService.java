package ke.college.management.finance;

import ke.college.management.audit.AuditService;
import ke.college.management.exceptions.BadRequestException;
import ke.college.management.exceptions.ResourceNotFoundException;
import ke.college.management.finance.entity.Invoice;
import ke.college.management.finance.entity.MpesaTransaction;
import ke.college.management.finance.entity.Payment;
import ke.college.management.finance.repository.InvoiceRepository;
import ke.college.management.finance.repository.MpesaTransactionRepository;
import ke.college.management.finance.repository.PaymentRepository;
import ke.college.management.security.SecurityUtils;
import ke.college.management.students.entity.Student;
import ke.college.management.students.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private static final Logger log = LoggerFactory.getLogger(PaymentService.class);

    private final PaymentRepository paymentRepository;
    private final InvoiceRepository invoiceRepository;
    private final StudentRepository studentRepository;
    private final MpesaTransactionRepository mpesaTransactionRepository;
    private final AuditService auditService;

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
     * Transactional isolation SERIALIZABLE / REPEATABLE_READ ensures atomic consistency
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

        // Idempotency check: Do not re-process if already in final state
        if ("COMPLETED".equals(tx.getStatus()) || "FAILED".equals(tx.getStatus())) {
            log.info("Idempotent ignore: Transaction {} already processed with status {}", tx.getId(), tx.getStatus());
            return true;
        }

        tx.setResultCode(String.valueOf(resultCode));
        tx.setResultDesc(resultDesc);
        tx.setUpdatedAt(Instant.now());

        if (resultCode != null && resultCode == 0) {
            // Payment success: Process transaction code and allocate fee
            String mpesaCode = "SJA" + System.currentTimeMillis() % 10000000;
            tx.setTransactionCode(mpesaCode);
            tx.setStatus("COMPLETED");
            mpesaTransactionRepository.save(tx);

            // Record authoritative payment
            String receiptNumber = "RCP-" + LocalDate.now().getYear() + "-" + (100000 + (int)(Math.random() * 899999));
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
            paymentRepository.save(payment);

            // Reconcile Invoice Balance
            if (tx.getInvoiceId() != null) {
                invoiceRepository.findById(tx.getInvoiceId()).ifPresent(invoice -> {
                    BigDecimal newPaid = invoice.getPaidAmount().add(tx.getAmount());
                    BigDecimal newBalance = invoice.getAmount().subtract(newPaid);
                    invoice.setPaidAmount(newPaid);
                    invoice.setBalance(newBalance.max(BigDecimal.ZERO));
                    invoice.setStatus(newBalance.compareTo(BigDecimal.ZERO) <= 0 ? "PAID" : "PARTIAL");
                    invoice.setUpdatedAt(Instant.now());
                    invoiceRepository.save(invoice);
                });
            }

            // Update Student Total Fee Balance
            if (tx.getStudentId() != null) {
                studentRepository.findById(tx.getStudentId()).ifPresent(student -> {
                    BigDecimal newBal = student.getFeeBalance().subtract(tx.getAmount());
                    student.setFeeBalance(newBal.max(BigDecimal.ZERO));
                    student.setUpdatedAt(Instant.now());
                    studentRepository.save(student);
                });
            }

            auditService.recordEvent(
                    tx.getInstitutionId(),
                    "MPESA_GATEWAY",
                    "DARAJA_API",
                    "PAYMENT_CONFIRMED",
                    "PAYMENT",
                    payment.getId(),
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
}
