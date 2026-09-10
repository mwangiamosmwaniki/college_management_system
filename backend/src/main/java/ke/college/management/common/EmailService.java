package ke.college.management.common;

import java.math.BigDecimal;

public interface EmailService {
    void sendPasswordResetEmail(String toEmail, String fullName, String resetLink);
    void sendAdmissionOfferEmail(String toEmail, String fullName, String admissionNumber, String programTitle);
    void sendAdmissionMatriculationEmail(String toEmail, String fullName, String admissionNumber, String temporaryPassword, String portalLoginUrl);
    void sendAccountActivationEmail(String toEmail, String fullName, String admissionNumber, String activationLink);
    void sendPaymentReceiptEmail(String toEmail, String fullName, String receiptNumber, BigDecimal amount, String transactionRef);
}
