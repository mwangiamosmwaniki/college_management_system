package ke.college.management.publicinquiry.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateInquiryRequest {

    @NotBlank(message = "Full name is required")
    @Size(min = 2, max = 128, message = "Name must be between 2 and 128 characters")
    private String fullName;

    @NotBlank(message = "Email address is required")
    @Email(message = "Must be a valid email address")
    private String email;

    @NotBlank(message = "Phone number is required")
    @Size(min = 8, max = 32, message = "Phone number must be valid")
    private String phone;

    private String department;

    @Size(max = 256, message = "Subject must be under 256 characters")
    private String subject;

    @NotBlank(message = "Inquiry message is required")
    @Size(min = 10, max = 3000, message = "Message must be between 10 and 3000 characters")
    private String message;

    // Honeypot field for spam bot protection: must be empty
    private String website;
}
