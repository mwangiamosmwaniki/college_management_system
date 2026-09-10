package ke.college.management.common;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;

@Service
@Slf4j
public class SmtpEmailService implements EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.mail.from:noreply@institution.ac.ke}")
    private String fromEmail;

    @Value("${app.mail.from-name:Institutional ERP Portal}")
    private String fromName;

    public SmtpEmailService(@Autowired(required = false) JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Override
    public void sendPasswordResetEmail(String toEmail, String fullName, String resetLink) {
        String subject = "Password Reset Request - Institutional College ERP";
        String htmlContent = """
            <!DOCTYPE html>
            <html>
            <head><meta charset="UTF-8"></head>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background-color: #1e3a8a; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
                    <h2 style="color: #ffffff; margin: 0;">College ERP Security Notification</h2>
                </div>
                <div style="padding: 24px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 8px 8px; background-color: #ffffff;">
                    <p>Dear <strong>%s</strong>,</p>
                    <p>A password reset request was initiated for your institutional account.</p>
                    <p>Click the secure button below to set a new password. This link is single-use and will expire in 15 minutes.</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="%s" style="background-color: #2563eb; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Reset My Password</a>
                    </div>
                    <p style="font-size: 13px; color: #64748b;">If you did not request this password change, please disregard this email or notify your campus IT administrator immediately.</p>
                    <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
                    <p style="font-size: 11px; color: #94a3b8; text-align: center;">Institutional ERP System &bull; Automated Security Service &bull; Do Not Reply</p>
                </div>
            </body>
            </html>
            """.formatted(escapeHtml(fullName), resetLink);

        sendEmail(toEmail, subject, htmlContent);
    }

    @Override
    public void sendAdmissionOfferEmail(String toEmail, String fullName, String admissionNumber, String programTitle) {
        String subject = "Official Admission Offer & Enrollment Confirmation";
        String htmlContent = """
            <!DOCTYPE html>
            <html>
            <head><meta charset="UTF-8"></head>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background-color: #047857; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
                    <h2 style="color: #ffffff; margin: 0;">Admissions & Enrollment Notice</h2>
                </div>
                <div style="padding: 24px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 8px 8px; background-color: #ffffff;">
                    <p>Dear <strong>%s</strong>,</p>
                    <p>Congratulations! Your admission application for <strong>%s</strong> has been approved and officially matriculated.</p>
                    <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 6px; padding: 16px; margin: 20px 0;">
                        <p style="margin: 0; color: #166534; font-size: 14px;"><strong>Official Admission Number:</strong> %s</p>
                    </div>
                    <p>You may now access the Student Portal using your Admission Number as your login identifier.</p>
                    <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
                    <p style="font-size: 11px; color: #94a3b8; text-align: center;">Registrar of Academic Affairs &bull; Institutional ERP</p>
                </div>
            </body>
            </html>
            """.formatted(escapeHtml(fullName), escapeHtml(programTitle), escapeHtml(admissionNumber));

        sendEmail(toEmail, subject, htmlContent);
    }

    @Override
    public void sendAdmissionMatriculationEmail(String toEmail, String fullName, String admissionNumber, String temporaryPassword, String portalLoginUrl) {
        String subject = "Official Admission & Student Account Credentials - Institutional ERP";
        String htmlContent = """
            <!DOCTYPE html>
            <html>
            <head><meta charset="UTF-8"></head>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background-color: #047857; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
                    <h2 style="color: #ffffff; margin: 0;">Institutional Student Enrollment</h2>
                </div>
                <div style="padding: 24px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 8px 8px; background-color: #ffffff;">
                    <p>Dear <strong>%s</strong>,</p>
                    <p>Congratulations! You have been officially enrolled as a student. Your institutional portal credentials are below:</p>
                    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 16px; margin: 20px 0;">
                        <p style="margin: 4px 0; color: #0f172a;"><strong>Admission Number:</strong> %s</p>
                        <p style="margin: 4px 0; color: #0f172a;"><strong>Temporary Password:</strong> <code style="background: #e2e8f0; padding: 2px 6px; border-radius: 4px;">%s</code></p>
                    </div>
                    <p>Please log in and change your temporary password immediately.</p>
                    <div style="text-align: center; margin: 24px 0;">
                        <a href="%s" style="background-color: #047857; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Login to Student Portal</a>
                    </div>
                    <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
                    <p style="font-size: 11px; color: #94a3b8; text-align: center;">Office of the Registrar &bull; Institutional ERP Portal</p>
                </div>
            </body>
            </html>
            """.formatted(escapeHtml(fullName), escapeHtml(admissionNumber), escapeHtml(temporaryPassword), portalLoginUrl);

        sendEmail(toEmail, subject, htmlContent);
    }

    @Override
    public void sendAccountActivationEmail(String toEmail, String fullName, String admissionNumber, String activationLink) {
        String subject = "Action Required: Activate Your Student Portal Account";
        String htmlContent = """
            <!DOCTYPE html>
            <html>
            <head><meta charset="UTF-8"></head>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background-color: #1e3a8a; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
                    <h2 style="color: #ffffff; margin: 0;">Institutional Student Enrollment</h2>
                </div>
                <div style="padding: 24px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 8px 8px; background-color: #ffffff;">
                    <p>Dear <strong>%s</strong>,</p>
                    <p>Congratulations on your official enrollment! Your admission details are as follows:</p>
                    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 16px; margin: 20px 0;">
                        <p style="margin: 4px 0; color: #0f172a;"><strong>Official Admission Number:</strong> %s</p>
                    </div>
                    <p>For your security, please activate your account and create your private password using the single-use link below. This activation link expires in 48 hours.</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="%s" style="background-color: #1e3a8a; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Activate My Account</a>
                    </div>
                    <p style="font-size: 13px; color: #64748b;">Notice: Never share your activation link with anyone. Once activated, you can access course registrations, fee statements, and institutional documents.</p>
                    <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
                    <p style="font-size: 11px; color: #94a3b8; text-align: center;">Office of the Registrar (Academic Affairs) &bull; Institutional ERP Portal</p>
                </div>
            </body>
            </html>
            """.formatted(escapeHtml(fullName), escapeHtml(admissionNumber), activationLink);

        sendEmail(toEmail, subject, htmlContent);
    }

    @Override
    public void sendPaymentReceiptEmail(String toEmail, String fullName, String receiptNumber, BigDecimal amount, String transactionRef) {
        String subject = "Payment Receipt: " + receiptNumber;
        String htmlContent = """
            <!DOCTYPE html>
            <html>
            <head><meta charset="UTF-8"></head>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background-color: #1e3a8a; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
                    <h2 style="color: #ffffff; margin: 0;">Official Fee Receipt</h2>
                </div>
                <div style="padding: 24px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 8px 8px; background-color: #ffffff;">
                    <p>Dear <strong>%s</strong>,</p>
                    <p>We confirm receipt of your institutional fee payment:</p>
                    <table style="width: 100%%; border-collapse: collapse; margin: 16px 0;">
                        <tr><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;"><strong>Receipt Number:</strong></td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">%s</td></tr>
                        <tr><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;"><strong>Amount Paid:</strong></td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">KES %s</td></tr>
                        <tr><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;"><strong>Transaction Ref:</strong></td><td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">%s</td></tr>
                    </table>
                    <p>Your fee balance has been credited in the institutional student ledger.</p>
                </div>
            </body>
            </html>
            """.formatted(escapeHtml(fullName), escapeHtml(receiptNumber), amount.toPlainString(), escapeHtml(transactionRef));

        sendEmail(toEmail, subject, htmlContent);
    }

    private void sendEmail(String toEmail, String subject, String htmlContent) {
        if (mailSender == null) {
            log.warn("JavaMailSender is not configured. Email to {} with subject '{}' was skipped.", toEmail, subject);
            return;
        }

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED, StandardCharsets.UTF_8.name());
            helper.setTo(toEmail);
            helper.setFrom(fromEmail, fromName);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);

            mailSender.send(message);
            log.info("Email successfully sent to: {} with subject: {}", toEmail, subject);
        } catch (MessagingException ex) {
            log.error("Failed to construct or dispatch email to {}: {}", toEmail, ex.getMessage());
        } catch (Exception ex) {
            log.error("Mail provider transport error when sending to {}: {}", toEmail, ex.getMessage());
        }
    }

    private String escapeHtml(String text) {
        if (text == null) return "";
        return text.replace("&", "&amp;")
                   .replace("<", "&lt;")
                   .replace(">", "&gt;")
                   .replace("\"", "&quot;")
                   .replace("'", "&#39;");
    }
}
