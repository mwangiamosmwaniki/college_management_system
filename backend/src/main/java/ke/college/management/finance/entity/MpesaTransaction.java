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
@Table(name = "mpesa_transactions")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MpesaTransaction {

    @Id
    @Column(length = 64)
    private String id;

    @Column(name = "institution_id", nullable = false, length = 64)
    private String institutionId;

    @Column(name = "student_id", length = 64)
    private String studentId;

    @Column(name = "invoice_id", length = 64)
    private String invoiceId;

    @Column(name = "merchant_request_id", nullable = false, length = 128)
    private String merchantRequestId;

    @Column(name = "checkout_request_id", nullable = false, unique = true, length = 128)
    private String checkoutRequestId;

    @Column(name = "phone_number", nullable = false, length = 32)
    private String phoneNumber;

    @Column(nullable = false)
    private BigDecimal amount;

    @Column(name = "account_reference", nullable = false, length = 64)
    private String accountReference;

    @Column(name = "transaction_code", length = 64)
    private String transactionCode;

    @Column(name = "mpesa_receipt_number", length = 64)
    private String mpesaReceiptNumber;

    @Column(name = "transaction_date")
    private Instant transactionDate;

    @Column(length = 32)
    @Builder.Default
    private String status = "PENDING"; // INITIATED, PENDING, SUCCESS, FAILED, CANCELLED, REVERSED

    @Column(name = "result_code", length = 32)
    private String resultCode;

    @Column(name = "result_desc", length = 255)
    private String resultDesc;

    @Column(name = "callback_payload", columnDefinition = "jsonb")
    private String callbackPayload;

    @Column(name = "created_at", updatable = false)
    @Builder.Default
    private Instant createdAt = Instant.now();

    @Column(name = "updated_at")
    @Builder.Default
    private Instant updatedAt = Instant.now();
}
