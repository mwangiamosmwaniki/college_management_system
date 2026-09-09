package ke.college.management.finance.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecordPaymentRequest {

    @NotBlank(message = "Student ID is required")
    private String studentId;

    private String invoiceId;

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "1.00", message = "Amount must be at least 1.00")
    private BigDecimal amount;

    @NotBlank(message = "Payment method is required")
    private String paymentMethod; // BANK_TRANSFER, CASH, CHEQUE, MPESA

    @NotBlank(message = "Transaction reference is required")
    private String transactionReference;

    private String payerName;
    private String payerPhone;
}
