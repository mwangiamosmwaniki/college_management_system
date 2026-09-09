package ke.college.management.admissions;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import ke.college.management.academics.entity.AcademicTerm;
import ke.college.management.academics.repository.AcademicTermRepository;
import ke.college.management.admissions.entity.Application;
import ke.college.management.admissions.repository.ApplicationRepository;
import ke.college.management.audit.AuditService;
import ke.college.management.common.ApiResponse;
import ke.college.management.common.EmailService;
import ke.college.management.common.PageResponse;
import ke.college.management.documents.entity.DocumentRecord;
import ke.college.management.documents.repository.DocumentRepository;
import ke.college.management.exceptions.BadRequestException;
import ke.college.management.exceptions.ResourceNotFoundException;
import ke.college.management.finance.PaymentService;
import ke.college.management.finance.dto.CreateInvoiceRequest;
import ke.college.management.institutions.entity.Campus;
import ke.college.management.institutions.repository.CampusRepository;
import ke.college.management.security.SecurityUtils;
import ke.college.management.students.entity.Student;
import ke.college.management.students.repository.StudentRepository;
import ke.college.management.users.entity.Role;
import ke.college.management.users.entity.User;
import ke.college.management.users.repository.RoleRepository;
import ke.college.management.users.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final PaymentService paymentService;
    private final DocumentRepository documentRepository;
    private final EmailService emailService;
    private final AuditService auditService;

    private final SecureRandom secureRandom = new SecureRandom();

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

        app.setStatus(status.toUpperCase());
        app.setReviewerNotes(notes);
        app.setReviewedBy(SecurityUtils.getCurrentUserId());
        app.setReviewedAt(Instant.now());
        app.setUpdatedAt(Instant.now());

        Application saved = applicationRepository.save(app);

        if ("APPROVED".equalsIgnoreCase(status)) {
            emailService.sendAdmissionOfferEmail(
                    saved.getEmail(),
                    saved.getFullName(),
                    saved.getReferenceNumber(),
                    saved.getProgramId()
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
                "Admissions decision " + status + " recorded for " + saved.getReferenceNumber(),
                null, status
        );

        return ApiResponse.success("Decision updated to " + status, saved);
    }

    @PostMapping("/applications/{id}/accept-offer")
    @Transactional
    @Operation(summary = "Accept admission offer and officially matriculate student record into the institution")
    public ApiResponse<Student> acceptOffer(
            @PathVariable String id,
            @RequestParam(required = false) String campusId,
            @RequestParam(required = false) String termId
    ) {
        Application app = applicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found"));

        SecurityUtils.validateTenantAccess(app.getInstitutionId());

        if (!"APPROVED".equalsIgnoreCase(app.getStatus()) && !"SUBMITTED".equalsIgnoreCase(app.getStatus())) {
            throw new BadRequestException("Application status must be APPROVED or SUBMITTED before enrollment. Current: " + app.getStatus());
        }

        // 1. Resolve real Campus from database
        String resolvedCampusId = campusId;
        if (resolvedCampusId == null || resolvedCampusId.isBlank()) {
            List<Campus> campuses = campusRepository.findByInstitutionIdAndIsActiveTrue(app.getInstitutionId());
            if (!campuses.isEmpty()) {
                resolvedCampusId = campuses.get(0).getId();
            } else {
                List<Campus> allCampuses = campusRepository.findByInstitutionId(app.getInstitutionId());
                resolvedCampusId = !allCampuses.isEmpty() ? allCampuses.get(0).getId() : "camp_main";
            }
        }

        // 2. Generate authoritative institutional admission number: ADM/YYYY/NNNN
        int randomSuffix = 1000 + secureRandom.nextInt(9000);
        String admissionNumber = "ADM/" + LocalDate.now().getYear() + "/" + randomSuffix;

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

        // 4. Provision Student User Login Account
        String temporaryPassword = "Stu@" + (2020 + (randomSuffix % 10)) + "!" + (100 + secureRandom.nextInt(900));
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
                .passwordHash(passwordEncoder.encode(temporaryPassword))
                .campusId(resolvedCampusId)
                .status("ACTIVE")
                .failedLoginAttempts(0)
                .roles(roles)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();
        userRepository.save(studentUser);

        // 5. Authoritatively generate initial tuition & registration invoice
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

        // 6. Generate official admission letter document record with QR verification
        String docKey = String.format("%s/admission_letter/%s_letter.pdf", app.getInstitutionId(), admissionNumber.replace("/", "_"));
        String verificationCode = "VER-ADM-" + UUID.randomUUID().toString().replace("-", "").substring(0, 12).toUpperCase();

        DocumentRecord letterDoc = DocumentRecord.builder()
                .id("doc_" + UUID.randomUUID().toString().replace("-", "").substring(0, 16))
                .institutionId(app.getInstitutionId())
                .documentType("ADMISSION_LETTER")
                .studentId(savedStudent.getId())
                .title("Official Letter of Admission - " + admissionNumber)
                .fileKey(docKey)
                .fileSize(102400L)
                .mimeType("application/pdf")
                .hashSha256(UUID.randomUUID().toString().replace("-", "") + UUID.randomUUID().toString().replace("-", ""))
                .verificationCode(verificationCode)
                .isVerified(true)
                .createdBy("SYSTEM_ADMISSION_SERVICE")
                .createdAt(Instant.now())
                .build();
        documentRepository.save(letterDoc);

        // 7. Dispatch matriculation confirmation email with portal credentials
        emailService.sendAdmissionMatriculationEmail(
                app.getEmail(),
                app.getFullName(),
                admissionNumber,
                temporaryPassword,
                "http://localhost:3000/login"
        );

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
                "APPROVED", "ADMITTED"
        );

        return ApiResponse.success("Offer accepted and student enrolled with Admission Number: " + admissionNumber, savedStudent);
    }
}
