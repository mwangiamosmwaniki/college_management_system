package ke.college.management.admissions;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import ke.college.management.academics.entity.AcademicTerm;
import ke.college.management.academics.repository.AcademicTermRepository;
import ke.college.management.admissions.entity.Application;
import ke.college.management.admissions.repository.ApplicationRepository;
import ke.college.management.audit.AuditService;
import ke.college.management.auth.AuthService;
import ke.college.management.common.ApiResponse;
import ke.college.management.common.EmailService;
import ke.college.management.common.PageResponse;
import ke.college.management.documents.DocumentStorageService;
import ke.college.management.documents.PdfGeneratorService;
import ke.college.management.documents.repository.DocumentRepository;
import ke.college.management.exceptions.BadRequestException;
import ke.college.management.exceptions.ResourceNotFoundException;
import ke.college.management.finance.PaymentService;
import ke.college.management.finance.dto.CreateInvoiceRequest;
import ke.college.management.institutions.entity.Campus;
import ke.college.management.institutions.repository.CampusRepository;
import ke.college.management.institutions.repository.InstitutionRepository;
import ke.college.management.security.SecurityUtils;
import ke.college.management.students.entity.Student;
import ke.college.management.students.repository.StudentRepository;
import ke.college.management.users.entity.Role;
import ke.college.management.users.entity.User;
import ke.college.management.users.repository.RoleRepository;
import ke.college.management.users.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.security.SecureRandom;
import java.time.Instant;
import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admissions")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Admissions", description = "Student applications, review workflows, decisions and admission enrollment")
public class AdmissionsController {

    private final ApplicationRepository applicationRepository;
    private final StudentRepository studentRepository;
    private final CampusRepository campusRepository;
    private final AcademicTermRepository academicTermRepository;
    private final InstitutionRepository institutionRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final PaymentService paymentService;
    private final DocumentRepository documentRepository;
    private final DocumentStorageService documentStorageService;
    private final PdfGeneratorService pdfGeneratorService;
    private final AdmissionSequenceService admissionSequenceService;
    private final AuthService authService;
    private final EmailService emailService;
    private final AuditService auditService;

    @Value("${app.mail.frontend-url:http://localhost:3000}")
    private String frontendUrl;

    private final SecureRandom secureRandom = new SecureRandom();

    /**
     * Server-side authoritative state transition validator enforcing:
     * DRAFT -> SUBMITTED -> UNDER_REVIEW -> APPROVED / CONDITIONAL / REJECTED -> OFFER_ACCEPTED -> ADMITTED
     */
    private void validateTransition(String currentStatus, String targetStatus) {
        String current = currentStatus != null ? currentStatus.trim().toUpperCase() : "DRAFT";
        String target = targetStatus != null ? targetStatus.trim().toUpperCase() : "";

        switch (target) {
            case "SUBMITTED":
                if (!"DRAFT".equals(current)) {
                    throw new BadRequestException("Only DRAFT applications can be transitioned to SUBMITTED. Current status: " + current);
                }
                break;
            case "UNDER_REVIEW":
                if (!"SUBMITTED".equals(current)) {
                    throw new BadRequestException("Only SUBMITTED applications can be put UNDER_REVIEW. Current status: " + current);
                }
                break;
            case "APPROVED":
            case "CONDITIONAL":
            case "REJECTED":
                if (!"UNDER_REVIEW".equals(current)) {
                    throw new BadRequestException("Admissions decision requires application to be UNDER_REVIEW. Current status: " + current);
                }
                break;
            case "OFFER_ACCEPTED":
                if ("REJECTED".equals(current)) {
                    throw new BadRequestException("REJECTED applications cannot accept an admission offer.");
                }
                if ("CONDITIONAL".equals(current)) {
                    throw new BadRequestException("CONDITIONAL offers cannot be accepted until conditions are satisfied and status is APPROVED.");
                }
                if ("OFFER_ACCEPTED".equals(current)) {
                    throw new BadRequestException("Admission offer has already been accepted.");
                }
                if ("ADMITTED".equals(current)) {
                    throw new BadRequestException("Application has already been matriculated into a student record.");
                }
                if (!"APPROVED".equals(current)) {
                    throw new BadRequestException("Acceptance occurs ONLY from APPROVED status. Current status: " + current);
                }
                break;
            case "ADMITTED":
                if ("ADMITTED".equals(current)) {
                    throw new BadRequestException("Application is already matriculated. Cannot enroll again.");
                }
                if ("SUBMITTED".equals(current)) {
                    throw new BadRequestException("SUBMITTED applications cannot create a student. Must complete review and offer acceptance.");
                }
                if ("REJECTED".equals(current)) {
                    throw new BadRequestException("REJECTED applications cannot be enrolled.");
                }
                if ("CONDITIONAL".equals(current)) {
                    throw new BadRequestException("CONDITIONAL offers cannot be enrolled until conditions are satisfied.");
                }
                if (!"OFFER_ACCEPTED".equals(current)) {
                    throw new BadRequestException("Matriculation occurs ONLY from OFFER_ACCEPTED status. Current status: " + current);
                }
                break;
            default:
                throw new BadRequestException("Unknown or unsupported status transition: " + target);
        }
    }

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
        int randomCode = 1000 + secureRandom.nextInt(9000);
        app.setReferenceNumber("APP-" + LocalDate.now().getYear() + "-" + randomCode);
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

    @PutMapping("/applications/{id}/review")
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('STUDENT_EDIT')")
    @Operation(summary = "Transition application from SUBMITTED to UNDER_REVIEW")
    public ApiResponse<Application> startReview(@PathVariable String id) {
        String institutionId = SecurityUtils.getCurrentInstitutionId();
        Application app = applicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found"));

        SecurityUtils.validateTenantAccess(app.getInstitutionId());

        validateTransition(app.getStatus(), "UNDER_REVIEW");

        String previousStatus = app.getStatus();
        app.setStatus("UNDER_REVIEW");
        app.setReviewedBy(SecurityUtils.getCurrentUserId());
        app.setReviewedAt(Instant.now());
        app.setUpdatedAt(Instant.now());

        Application saved = applicationRepository.save(app);

        auditService.recordEvent(
                institutionId,
                SecurityUtils.getCurrentUserId(),
                SecurityUtils.getCurrentUserDetails().getIdentifier(),
                "APPLICATION_REVIEW_START",
                "APPLICATION",
                saved.getId(),
                "SUCCESS",
                null, null, null,
                "Application " + saved.getReferenceNumber() + " moved to UNDER_REVIEW",
                previousStatus, "UNDER_REVIEW"
        );

        return ApiResponse.success("Application is now under review", saved);
    }

    @PutMapping("/applications/{id}/decision")
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('STUDENT_EDIT')")
    @Operation(summary = "Record admissions decision (APPROVED, REJECTED, CONDITIONAL)")
    public ApiResponse<Application> decideApplication(
            @PathVariable String id,
            @RequestParam String status,
            @RequestParam(required = false) String notes
    ) {
        String institutionId = SecurityUtils.getCurrentInstitutionId();
        Application app = applicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found"));

        SecurityUtils.validateTenantAccess(app.getInstitutionId());

        String targetStatus = status != null ? status.trim().toUpperCase() : "";
        if (!List.of("APPROVED", "CONDITIONAL", "REJECTED").contains(targetStatus)) {
            throw new BadRequestException("Decision status must be APPROVED, CONDITIONAL, or REJECTED");
        }

        validateTransition(app.getStatus(), targetStatus);

        String previousStatus = app.getStatus();
        app.setStatus(targetStatus);
        app.setReviewerNotes(notes);
        app.setReviewedBy(SecurityUtils.getCurrentUserId());
        app.setReviewedAt(Instant.now());
        app.setUpdatedAt(Instant.now());

        Application saved = applicationRepository.save(app);

        if ("APPROVED".equalsIgnoreCase(targetStatus)) {
            emailService.sendAdmissionOfferEmail(
                    saved.getEmail(),
                    saved.getFullName(),
                    saved.getReferenceNumber(),
                    saved.getProgramId() != null ? saved.getProgramId() : "Academic Program"
            );
        }

        auditService.recordEvent(
                institutionId,
                SecurityUtils.getCurrentUserId(),
                SecurityUtils.getCurrentUserDetails().getIdentifier(),
                "ADMISSION_DECISION",
                "APPLICATION",
                saved.getId(),
                "SUCCESS",
                null, null, null,
                "Admissions decision " + targetStatus + " recorded for " + saved.getReferenceNumber(),
                previousStatus, targetStatus
        );

        return ApiResponse.success("Decision updated to " + targetStatus, saved);
    }

    @PostMapping("/applications/{id}/accept-offer")
    @Operation(summary = "Applicant accepts an APPROVED admission offer, transitioning to OFFER_ACCEPTED")
    public ApiResponse<Application> acceptOffer(@PathVariable String id) {
        Application app = applicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found"));

        SecurityUtils.validateTenantAccess(app.getInstitutionId());

        validateTransition(app.getStatus(), "OFFER_ACCEPTED");

        app.setStatus("OFFER_ACCEPTED");
        app.setUpdatedAt(Instant.now());
        Application saved = applicationRepository.save(app);

        auditService.recordEvent(
                app.getInstitutionId(),
                app.getEmail(),
                app.getFullName(),
                "OFFER_ACCEPTED",
                "APPLICATION",
                saved.getId(),
                "SUCCESS",
                null, null, null,
                "Admission offer accepted for application " + saved.getReferenceNumber(),
                "APPROVED", "OFFER_ACCEPTED"
        );

        return ApiResponse.success("Admission offer successfully accepted. Proceed to matriculation.", saved);
    }

    @PostMapping("/applications/{id}/matriculate")
    @Transactional
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('STUDENT_EDIT')")
    @Operation(summary = "Matriculate student from OFFER_ACCEPTED application into institutional records")
    public ApiResponse<Student> matriculate(
            @PathVariable String id,
            @RequestParam(required = false) String campusId,
            @RequestParam(required = false) String termId
    ) {
        Application app = applicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found"));

        SecurityUtils.validateTenantAccess(app.getInstitutionId());

        // Strict state machine validation: Matriculation occurs ONLY from OFFER_ACCEPTED
        validateTransition(app.getStatus(), "ADMITTED");

        // 1. Authoritative Campus Resolution (No synthetic IDs such as camp_main)
        String resolvedCampusId;
        Campus selectedCampus;
        if (campusId != null && !campusId.isBlank()) {
            selectedCampus = campusRepository.findById(campusId.trim())
                    .orElseThrow(() -> new BadRequestException("Specified campus not found: " + campusId));
            if (!app.getInstitutionId().equals(selectedCampus.getInstitutionId())) {
                throw new BadRequestException("Specified campus does not belong to this institution.");
            }
            if (Boolean.FALSE.equals(selectedCampus.getIsActive())) {
                throw new BadRequestException("Specified campus is not currently active.");
            }
            resolvedCampusId = selectedCampus.getId();
        } else {
            List<Campus> activeCampuses = campusRepository.findByInstitutionIdAndIsActiveTrue(app.getInstitutionId());
            if (activeCampuses.isEmpty()) {
                throw new BadRequestException("No valid campus is configured for this institution.");
            }
            selectedCampus = activeCampuses.get(0);
            resolvedCampusId = selectedCampus.getId();
        }

        // 2. Authoritative Admission Number Generation: ADM/{YEAR}/{000001}
        int academicYear = LocalDate.now().getYear();
        String admissionNumber = admissionSequenceService.generateNextAdmissionNumber(app.getInstitutionId(), academicYear);

        // 3. Create Student record
        Student student = Student.builder()
                .id("stu_" + UUID.randomUUID().toString().replace("-", "").substring(0, 16))
                .institutionId(app.getInstitutionId())
                .campusId(resolvedCampusId)
                .programId(app.getProgramId())
                .admissionNumber(admissionNumber)
                .fullName(app.getFullName())
                .email(app.getEmail())
                .phoneNumber(app.getPhoneNumber())
                .nationalId(app.getNationalId())
                .status("ACTIVE")
                .feeBalance(BigDecimal.ZERO)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();

        Student savedStudent = studentRepository.save(student);

        // 4. Provision Student User Login Account in PENDING_ACTIVATION
        Optional<Role> studentRoleOpt = roleRepository.findByInstitutionIdAndCode(app.getInstitutionId(), "STUDENT");
        if (studentRoleOpt.isEmpty()) {
            studentRoleOpt = roleRepository.findByCode("STUDENT");
        }
        Set<Role> roles = studentRoleOpt.map(Set::of).orElse(Collections.emptySet());

        User studentUser = User.builder()
                .id("usr_" + UUID.randomUUID().toString().replace("-", "").substring(0, 16))
                .institutionId(app.getInstitutionId())
                .identifier(admissionNumber)
                .email(app.getEmail())
                .fullName(app.getFullName())
                .passwordHash(passwordEncoder.encode(UUID.randomUUID().toString()))
                .campusId(resolvedCampusId)
                .status("PENDING_ACTIVATION")
                .failedLoginAttempts(0)
                .roles(roles)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();
        userRepository.save(studentUser);

        // 5. Generate secure single-use activation token and send activation email
        String rawActivationToken = authService.createAccountActivationToken(app.getInstitutionId(), studentUser.getId());
        String activationUrl = frontendUrl + "/app?action=activate-account&token=" + rawActivationToken;
        emailService.sendAccountActivationEmail(
                app.getEmail(),
                app.getFullName(),
                admissionNumber,
                activationUrl
        );

        // 6. Generate real PDF Admission Letter with real SHA-256 and S3 storage
        String institutionName = institutionRepository.findById(app.getInstitutionId())
                .map(inst -> inst.getName())
                .orElse("Institutional College");
        String campusName = selectedCampus != null ? selectedCampus.getName() : "Main Campus";
        String academicTermName = termId != null ? termId : ("Academic Year " + academicYear);
        String verificationCode = "VER-ADM-" + UUID.randomUUID().toString().replace("-", "").substring(0, 12).toUpperCase();

        byte[] letterPdfBytes = pdfGeneratorService.generateAdmissionLetter(
                institutionName,
                app.getFullName(),
                admissionNumber,
                app.getProgramId() != null ? app.getProgramId() : "Academic Program",
                campusName,
                academicTermName,
                verificationCode
        );

        documentStorageService.storeGeneratedDocument(
                letterPdfBytes,
                "ADMISSION_LETTER",
                savedStudent.getId(),
                "Official Letter of Admission - " + admissionNumber,
                "application/pdf",
                app.getInstitutionId(),
                SecurityUtils.getCurrentUserId()
        );

        // 7. Authoritatively generate initial tuition & registration fee invoice
        try {
            CreateInvoiceRequest invoiceReq = new CreateInvoiceRequest();
            invoiceReq.setStudentId(savedStudent.getId());
            invoiceReq.setTitle("Tuition & Registration Fee - Term 1");
            invoiceReq.setAmount(new BigDecimal("45000.00"));
            invoiceReq.setDueDate(LocalDate.now().plusDays(30));
            invoiceReq.setDescription("Automated initial admission fee billing for " + admissionNumber);
            paymentService.createInvoice(invoiceReq);
        } catch (Exception ex) {
            log.warn("Initial invoice creation warning for admitted student {}: {}", savedStudent.getId(), ex.getMessage());
        }

        // 8. Update Application Status to ADMITTED
        app.setStatus("ADMITTED");
        app.setUpdatedAt(Instant.now());
        applicationRepository.save(app);

        auditService.recordEvent(
                app.getInstitutionId(),
                savedStudent.getId(),
                admissionNumber,
                "STUDENT_ADMITTED",
                "STUDENT",
                savedStudent.getId(),
                "SUCCESS",
                null, null, null,
                "Student matriculated from application " + app.getReferenceNumber() + " with Admission No: " + admissionNumber,
                "OFFER_ACCEPTED", "ADMITTED"
        );

        return ApiResponse.success("Offer accepted and student enrolled with Admission Number: " + admissionNumber, savedStudent);
    }
}
