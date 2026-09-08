package ke.college.management.admissions;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import ke.college.management.admissions.entity.Application;
import ke.college.management.admissions.repository.ApplicationRepository;
import ke.college.management.audit.AuditService;
import ke.college.management.common.ApiResponse;
import ke.college.management.common.PageResponse;
import ke.college.management.exceptions.ResourceNotFoundException;
import ke.college.management.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admissions")
@RequiredArgsConstructor
@Tag(name = "Admissions", description = "Student applications, review workflows and admission decisions")
public class AdmissionsController {

    private final ApplicationRepository applicationRepository;
    private final AuditService auditService;

    @GetMapping("/applications")
    @PreAuthorize("hasAuthority('STUDENT_VIEW') or hasRole('ADMIN')")
    @Operation(summary = "Get paginated admissions applications")
    public ApiResponse<PageResponse<Application>> getApplications(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        String institutionId = SecurityUtils.getCurrentInstitutionId();
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Application> appPage = applicationRepository.findByInstitutionId(institutionId, pageRequest);
        return ApiResponse.success(PageResponse.from(appPage));
    }

    @PostMapping("/applications")
    @Operation(summary = "Submit new admission application")
    public ApiResponse<Application> submitApplication(@RequestBody Application app) {
        String institutionId = SecurityUtils.getCurrentInstitutionId();
        app.setId("app_" + UUID.randomUUID().toString().replace("-", "").substring(0, 16));
        app.setInstitutionId(institutionId);
        app.setReferenceNumber("APP-" + LocalDate.now().getYear() + "-" + (1000 + (int)(Math.random() * 8999)));
        app.setStatus("SUBMITTED");
        app.setCreatedAt(Instant.now());
        app.setUpdatedAt(Instant.now());

        Application saved = applicationRepository.save(app);

        auditService.recordEvent(
                institutionId,
                "APPLICANT",
                saved.getEmail(),
                "APPLICATION_SUBMIT",
                "APPLICATION",
                saved.getId(),
                "SUCCESS",
                null, null, null,
                "Submitted application for program " + saved.getProgramId() + ", Ref: " + saved.getReferenceNumber(),
                null, null
        );

        return ApiResponse.success("Application submitted successfully", saved);
    }

    @PutMapping("/applications/{id}/decision")
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('STUDENT_EDIT')")
    @Operation(summary = "Record admissions decision (APPROVED, REJECTED, ADMITTED)")
    public ApiResponse<Application> decideApplication(
            @PathVariable String id,
            @RequestParam String status,
            @RequestParam(required = false) String notes
    ) {
        String institutionId = SecurityUtils.getCurrentInstitutionId();
        Application app = applicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found"));

        SecurityUtils.validateTenantAccess(app.getInstitutionId());

        app.setStatus(status.toUpperCase());
        app.setReviewerNotes(notes);
        app.setReviewedBy(SecurityUtils.getCurrentUserId());
        app.setReviewedAt(Instant.now());
        app.setUpdatedAt(Instant.now());

        Application saved = applicationRepository.save(app);

        auditService.recordEvent(
                institutionId,
                SecurityUtils.getCurrentUserId(),
                SecurityUtils.getCurrentUserDetails().getIdentifier(),
                "ADMISSION_DECISION",
                "APPLICATION",
                saved.getId(),
                "SUCCESS",
                null, null, null,
                "Admissions decision " + status + " recorded for " + saved.getReferenceNumber(),
                null, status
        );

        return ApiResponse.success("Decision updated to " + status, saved);
    }
}
