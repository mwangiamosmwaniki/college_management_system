package ke.college.management.finance;

import ke.college.management.audit.AuditService;
import ke.college.management.finance.entity.FinancialLedger;
import ke.college.management.finance.entity.Invoice;
import ke.college.management.finance.entity.MpesaTransaction;
import ke.college.management.finance.entity.Payment;
import ke.college.management.finance.entity.PaymentAllocation;
import ke.college.management.finance.repository.FinancialLedgerRepository;
import ke.college.management.finance.repository.InvoiceRepository;
import ke.college.management.finance.repository.MpesaTransactionRepository;
import ke.college.management.finance.repository.PaymentAllocationRepository;
import ke.college.management.finance.repository.PaymentRepository;
import ke.college.management.security.SecurityUtils;
import ke.college.management.students.entity.Student;
import ke.college.management.students.repository.StudentRepository;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class FinanceReconciliationService {

    private final MpesaTransactionRepository mpesaTransactionRepository;
    private final PaymentRepository paymentRepository;
    private final InvoiceRepository invoiceRepository;
    private final PaymentAllocationRepository paymentAllocationRepository;
    private final FinancialLedgerRepository financialLedgerRepository;
    private final StudentRepository studentRepository;
    private final AuditService auditService;

    @Transactional(readOnly = true)
    public ReconciliationReport runReconciliation(String institutionId) {
        log.info("Initiating financial integrity and reconciliation audit for institution {}", institutionId);
        List<ReconciliationAnomaly> anomalies = new ArrayList<>();

        // 1. Audit M-Pesa Transactions vs Recorded Payments
        List<MpesaTransaction> mpesaTxList = mpesaTransactionRepository.findByInstitutionId(institutionId);
        List<Payment> paymentList = paymentRepository.findByInstitutionId(institutionId);

        Map<String, Payment> paymentByRef = new HashMap<>();
        Set<String> seenReceipts = new HashSet<>();
        for (Payment p : paymentList) {
            if (p.getTransactionReference() != null && !p.getTransactionReference().isBlank()) {
                if (!seenReceipts.add(p.getTransactionReference())) {
                    anomalies.add(ReconciliationAnomaly.builder()
                            .anomalyType("DUPLICATE_PAYMENT_REFERENCE")
                            .severity("HIGH")
                            .referenceId(p.getId())
                            .studentId(p.getStudentId())
                            .amount(p.getAmount())
                            .details("Duplicate transaction reference detected: " + p.getTransactionReference())
                            .detectedAt(Instant.now())
                            .build());
                }
                paymentByRef.put(p.getTransactionReference(), p);
            }
        }

        for (MpesaTransaction tx : mpesaTxList) {
            if ("SUCCESS".equals(tx.getStatus())) {
                String receiptNum = tx.getMpesaReceiptNumber() != null ? tx.getMpesaReceiptNumber() : tx.getTransactionCode();
                if (receiptNum == null || receiptNum.isBlank()) {
                    anomalies.add(ReconciliationAnomaly.builder()
                            .anomalyType("MISSING_MPESA_RECEIPT_CODE")
                            .severity("HIGH")
                            .referenceId(tx.getId())
                            .studentId(tx.getStudentId())
                            .amount(tx.getAmount())
                            .details("Successful M-Pesa transaction missing receipt code")
                            .detectedAt(Instant.now())
                            .build());
                } else {
                    Payment matchingPayment = paymentByRef.get(receiptNum);
                    if (matchingPayment == null) {
                        anomalies.add(ReconciliationAnomaly.builder()
                            .anomalyType("ORPHANED_MPESA_TX")
                            .severity("HIGH")
                            .referenceId(tx.getId())
                            .studentId(tx.getStudentId())
                            .amount(tx.getAmount())
                            .details("Successful M-Pesa transaction " + receiptNum + " has no corresponding payment entry")
                            .detectedAt(Instant.now())
                            .build());
                    } else if (matchingPayment.getAmount().compareTo(tx.getAmount()) != 0) {
                        anomalies.add(ReconciliationAnomaly.builder()
                            .anomalyType("AMOUNT_MISMATCH")
                            .severity("CRITICAL")
                            .referenceId(tx.getId())
                            .studentId(tx.getStudentId())
                            .amount(tx.getAmount())
                            .details("M-Pesa amount " + tx.getAmount() + " does not match recorded payment " + matchingPayment.getAmount())
                            .detectedAt(Instant.now())
                            .build());
                    }
                }
            }
        }

        // 2. Audit Invoice Balance vs Allocation Sums
        List<Invoice> invoices = invoiceRepository.findByInstitutionId(institutionId);
        for (Invoice invoice : invoices) {
            List<PaymentAllocation> allocations = paymentAllocationRepository.findByInvoiceId(invoice.getId());
            BigDecimal sumAllocations = allocations.stream()
                    .map(PaymentAllocation::getAllocatedAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            BigDecimal recordedPaid = invoice.getPaidAmount() != null ? invoice.getPaidAmount() : BigDecimal.ZERO;
            if (sumAllocations.compareTo(recordedPaid) != 0) {
                anomalies.add(ReconciliationAnomaly.builder()
                        .anomalyType("INVOICE_ALLOCATION_MISMATCH")
                        .severity("MEDIUM")
                        .referenceId(invoice.getId())
                        .studentId(invoice.getStudentId())
                        .amount(recordedPaid.subtract(sumAllocations).abs())
                        .details("Invoice " + invoice.getInvoiceNumber() + " paidAmount (" + recordedPaid +
                                 ") differs from allocations sum (" + sumAllocations + ")")
                        .detectedAt(Instant.now())
                        .build());
            }

            BigDecimal expectedBalance = invoice.getAmount().subtract(recordedPaid).max(BigDecimal.ZERO);
            BigDecimal recordedBalance = invoice.getBalance() != null ? invoice.getBalance() : BigDecimal.ZERO;
            if (expectedBalance.compareTo(recordedBalance) != 0) {
                anomalies.add(ReconciliationAnomaly.builder()
                        .anomalyType("INVOICE_BALANCE_MISMATCH")
                        .severity("HIGH")
                        .referenceId(invoice.getId())
                        .studentId(invoice.getStudentId())
                        .amount(expectedBalance.subtract(recordedBalance).abs())
                        .details("Invoice " + invoice.getInvoiceNumber() + " balance inconsistency: expected " +
                                 expectedBalance + " but recorded " + recordedBalance)
                        .detectedAt(Instant.now())
                        .build());
            }
        }

        // 3. Audit Student Running Balances against Ledger
        List<Student> students = studentRepository.findByInstitutionId(institutionId);
        for (Student student : students) {
            List<FinancialLedger> ledgerEntries = financialLedgerRepository.findByStudentId(student.getId());
            BigDecimal totalDebits = ledgerEntries.stream()
                    .map(FinancialLedger::getDebit)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            BigDecimal totalCredits = ledgerEntries.stream()
                    .map(FinancialLedger::getCredit)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            BigDecimal expectedStudentBalance = totalDebits.subtract(totalCredits);
            BigDecimal recordedStudentBalance = student.getFeeBalance() != null ? student.getFeeBalance() : BigDecimal.ZERO;

            if (expectedStudentBalance.compareTo(recordedStudentBalance) != 0) {
                anomalies.add(ReconciliationAnomaly.builder()
                        .anomalyType("STUDENT_LEDGER_BALANCE_MISMATCH")
                        .severity("CRITICAL")
                        .referenceId(student.getId())
                        .studentId(student.getId())
                        .amount(expectedStudentBalance.subtract(recordedStudentBalance).abs())
                        .details("Student " + student.getAdmissionNumber() + " fee balance (" + recordedStudentBalance +
                                 ") does not match ledger sum (" + expectedStudentBalance + ")")
                        .detectedAt(Instant.now())
                        .build());
            }
        }

        BigDecimal totalDiscrepancyAmount = anomalies.stream()
                .map(ReconciliationAnomaly::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        ReconciliationReport report = ReconciliationReport.builder()
                .institutionId(institutionId)
                .generatedAt(Instant.now())
                .totalTransactionsChecked(mpesaTxList.size() + paymentList.size() + invoices.size())
                .matchedTransactionsCount((mpesaTxList.size() + paymentList.size() + invoices.size()) - anomalies.size())
                .discrepancyCount(anomalies.size())
                .totalDiscrepancyAmount(totalDiscrepancyAmount)
                .status(anomalies.isEmpty() ? "BALANCED" : "DISCREPANCIES_DETECTED")
                .anomalies(anomalies)
                .build();

        auditService.recordEvent(
                institutionId,
                SecurityUtils.getCurrentUserId(),
                SecurityUtils.getCurrentUserDetails().getIdentifier(),
                "FINANCE_RECONCILIATION_RUN",
                "FINANCIAL_RECONCILIATION",
                UUID.randomUUID().toString(),
                report.getStatus(),
                null, null, null,
                "Financial reconciliation executed. Discrepancies found: " + anomalies.size(),
                null, null
        );

        return report;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ReconciliationReport {
        private String institutionId;
        private Instant generatedAt;
        private int totalTransactionsChecked;
        private int matchedTransactionsCount;
        private int discrepancyCount;
        private BigDecimal totalDiscrepancyAmount;
        private String status; // BALANCED, DISCREPANCIES_DETECTED
        private List<ReconciliationAnomaly> anomalies;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ReconciliationAnomaly {
        private String anomalyType;
        private String severity; // LOW, MEDIUM, HIGH, CRITICAL
        private String referenceId;
        private String studentId;
        private BigDecimal amount;
        private String details;
        private Instant detectedAt;
    }
}
