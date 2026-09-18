package ke.college.management.publicinquiry;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import ke.college.management.common.ApiResponse;
import ke.college.management.exceptions.BadRequestException;
import ke.college.management.publicinquiry.dto.CreateInquiryRequest;
import ke.college.management.publicinquiry.entity.PublicInquiry;
import ke.college.management.publicinquiry.repository.PublicInquiryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.time.Year;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ThreadLocalRandom;

@RestController
@RequestMapping("/api/v1/public/inquiries")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Public Inquiries", description = "Public administrative and admissions contact inquiries")
public class PublicInquiryController {

    private final PublicInquiryRepository publicInquiryRepository;

    @PostMapping
    @Operation(summary = "Submit a public administrative or admissions inquiry")
    public ApiResponse<Map<String, Object>> submitInquiry(
            @Valid @RequestBody CreateInquiryRequest request,
            HttpServletRequest httpRequest
    ) {
        // Honeypot spam bot protection
        if (request.getWebsite() != null && !request.getWebsite().isBlank()) {
            log.warn("Spam inquiry detected via honeypot from IP: {}", httpRequest.getRemoteAddr());
            throw new BadRequestException("Invalid inquiry submission");
        }

        String dept = (request.getDepartment() != null && !request.getDepartment().isBlank())
                ? request.getDepartment().trim().toUpperCase()
                : "ADMISSIONS";

        String subject = (request.getSubject() != null && !request.getSubject().isBlank())
                ? request.getSubject().trim()
                : "General Inquiry - " + dept;

        int currentYear = Year.now().getValue();
        int randomCode = ThreadLocalRandom.current().nextInt(10000, 99999);
        String referenceNumber = String.format("INQ-%d-%d", currentYear, randomCode);

        PublicInquiry inquiry = PublicInquiry.builder()
                .id("inq_" + UUID.randomUUID().toString().replace("-", "").substring(0, 16))
                .name(request.getFullName().trim())
                .email(request.getEmail().trim().toLowerCase())
                .phone(request.getPhone().trim())
                .department(dept)
                .subject(subject)
                .message(request.getMessage().trim())
                .status("PENDING")
                .referenceNumber(referenceNumber)
                .clientIp(httpRequest.getRemoteAddr())
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();

        PublicInquiry saved = publicInquiryRepository.save(inquiry);
        log.info("Persisted public inquiry {} for {} ({})", saved.getReferenceNumber(), saved.getName(), saved.getEmail());

        return ApiResponse.success("Inquiry submitted successfully", Map.of(
                "referenceNumber", saved.getReferenceNumber(),
                "status", saved.getStatus(),
                "department", saved.getDepartment(),
                "assignedAt", saved.getCreatedAt().toString(),
                "resolutionWindowHours", 24
        ));
    }
}
