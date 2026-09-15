package ke.college.management.finance.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;

/**
 * Public/Portal Data Transfer Object for M-Pesa Transactions.
 * Excludes internal provider identifiers (merchantRequestId, checkoutRequestId),
 * vendor result codes/descriptions, and raw webhook callback payloads.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MpesaTransactionResponseDto {
    private String id;
    private String institutionId;
    private String studentId;
    private String invoiceId;
    private String phoneNumber;
    private BigDecimal amount;
    private String accountReference;
    private String transactionCode;
    private String mpesaReceiptNumber;
    private Instant transactionDate;
    private String status;
    private Instant createdAt;
}
