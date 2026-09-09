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
@Table(name = "financial_ledger")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FinancialLedger {

    @Id
    private String id;

    @Column(name = "institution_id", nullable = false)
    private String institutionId;

    @Column(name = "student_id", nullable = false)
    private String studentId;

    @Column(name = "entry_type", nullable = false)
    private String entryType; // INVOICE_CHARGE, PAYMENT_CREDIT, REFUND_DEBIT, REVERSAL_DEBIT, WAIVER_CREDIT

    @Column(name = "reference_id", nullable = false)
    private String referenceId;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal amount;

    @Column(name = "running_balance", nullable = false, precision = 12, scale = 2)
    private BigDecimal runningBalance;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(name = "transaction_date", nullable = false)
    private Instant transactionDate;

    @Column(name = "created_by")
    private String createdBy;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;
}
