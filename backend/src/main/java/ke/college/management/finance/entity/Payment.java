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
@Table(name = "payments")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Payment {

    @Id
    @Column(length = 64)
    private String id;

    @Column(name = "institution_id", nullable = false, length = 64)
    private String institutionId;

    @Column(name = "student_id", nullable = false, length = 64)
    private String studentId;

    @Column(name = "invoice_id", length = 64)
    private String invoiceId;

    @Column(name = "receipt_number", nullable = false, unique = true, length = 64)
    private String receiptNumber;

    @Column(nullable = false)
    private BigDecimal amount;

    @Column(name = "payment_method", nullable = false, length = 32)
    private String paymentMethod; // MPESA, BANK_TRANSFER, CHEQUE

    @Column(name = "transaction_reference", nullable = false, length = 128)
    private String transactionReference;

    @Column(name = "payer_phone", length = 32)
    private String payerPhone;

    @Column(name = "payer_name", length = 128)
    private String payerName;

    @Column(length = 32)
    @Builder.Default
    private String status = "SUCCESS"; // INITIATED, PENDING, SUCCESS, FAILED, REVERSED

    @Column(name = "allocated_to_fee")
    @Builder.Default
    private Boolean allocatedToFee = true;

    @Column(name = "created_at", updatable = false)
    @Builder.Default
    private Instant createdAt = Instant.now();
}
