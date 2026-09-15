package ke.college.management.students;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import ke.college.management.academics.dto.StudentEnrolledCourseDto;
import ke.college.management.academics.entity.AcademicTerm;
import ke.college.management.academics.entity.Course;
import ke.college.management.academics.entity.CourseEnrollment;
import ke.college.management.academics.entity.StudentMark;
import ke.college.management.academics.repository.CourseEnrollmentRepository;
import ke.college.management.academics.repository.CourseRepository;
import ke.college.management.academics.repository.StudentMarkRepository;
import ke.college.management.academics.service.AcademicTermService;
import ke.college.management.audit.AuditService;
import ke.college.management.common.ApiResponse;
import ke.college.management.common.PageResponse;
import ke.college.management.exceptions.BusinessRuleException;
import ke.college.management.exceptions.ResourceNotFoundException;
import ke.college.management.exceptions.UnauthorizedException;
import ke.college.management.finance.entity.Invoice;
import ke.college.management.finance.entity.Payment;
import ke.college.management.finance.repository.InvoiceRepository;
import ke.college.management.finance.repository.PaymentRepository;
import ke.college.management.security.CustomUserDetails;
import ke.college.management.security.SecurityUtils;
import ke.college.management.students.dto.StudentResponseDto;
import ke.college.management.students.entity.Student;
import ke.college.management.students.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
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
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/students")
@RequiredArgsConstructor
@Tag(name = "Students", description = "Student registries, profiles and enrollment")
public class StudentController {

    private final StudentRepository studentRepository;
    private final CourseRepository courseRepository;
    private final CourseEnrollmentRepository courseEnrollmentRepository;
    private final InvoiceRepository invoiceRepository;
    private final PaymentRepository paymentRepository;
    private final StudentMarkRepository studentMarkRepository;
    private final AuditService auditService;
    private final AcademicTermService academicTermService;

    private StudentResponseDto toDto(Student student) {
        if (student == null) return null;
        return StudentResponseDto.builder()
                .id(student.getId())
                .admissionNumber(student.getAdmissionNumber())
                .fullName(student.getFullName())
                .campusId(student.getCampusId())
                .programId(student.getProgramId())
                .currentTermId(student.getCurrentTermId())
                .gender(student.getGender())
                .birthDate(student.getBirthDate())
                .phoneNumber(student.getPhoneNumber())
                .email(student.getEmail())
                .guardianName(student.getGuardianName())
                .guardianPhone(student.getGuardianPhone())
                .status(student.getStatus())
                .feeBalance(student.getFeeBalance())
                .createdAt(student.getCreatedAt())
                .build();
    }

    @GetMapping
    @PreAuthorize("hasAuthority('STUDENT_VIEW') or hasRole('ADMIN') or hasRole('LECTURER') or hasRole('FINANCE')")
    @Operation(summary = "Paginated student list with search and tenant isolation")
    public ApiResponse<PageResponse<StudentResponseDto>> getStudents(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String search
    ) {
        String institutionId = SecurityUtils.getCurrentInstitutionId();
        PageRequest pageable = PageRequest.of(page, size, Sort.by("admissionNumber").ascending());

        Page<Student> studentPage = (search != null && !search.isBlank())
                ? studentRepository.searchStudents(institutionId, search.trim(), pageable)
                : studentRepository.findByInstitutionId(institutionId, pageable);

        Page<StudentResponseDto> dtoPage = studentPage.map(this::toDto);
        return ApiResponse.success(PageResponse.from(dtoPage));
    }

    @GetMapping("/me")
    @Operation(summary = "Get current logged-in student profile")
    public ApiResponse<StudentResponseDto> getMyStudentProfile() {
        String institutionId = SecurityUtils.getCurrentInstitutionId();
        String currentUserId = SecurityUtils.getCurrentUserId();

        Student student = studentRepository.findByInstitutionIdAndUserId(institutionId, currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("No student profile linked to your account"));

        return ApiResponse.success(toDto(student));
    }

    @GetMapping("/me/courses")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get enrolled courses for current logged-in student")
    public ApiResponse<List<StudentEnrolledCourseDto>> getMyCourses() {
        String institutionId = SecurityUtils.getCurrentInstitutionId();
        String currentUserId = SecurityUtils.getCurrentUserId();

        Student student = studentRepository.findByInstitutionIdAndUserId(institutionId, currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("No student profile linked to your account"));

        String termId = student.getCurrentTermId();
        if (termId == null || termId.isBlank()) {
            Optional<AcademicTerm> activeTerm = academicTermService.findCurrentActiveTerm(institutionId);
            termId = activeTerm.map(AcademicTerm::getId).orElse(null);
        }

        List<CourseEnrollment> enrollments = (termId != null)
                ? courseEnrollmentRepository.findByStudentIdAndAcademicTermIdAndStatus(student.getId(), termId, "ENROLLED")
                : courseEnrollmentRepository.findByStudentIdAndStatus(student.getId(), "ENROLLED");

        if (enrollments.isEmpty()) {
            return ApiResponse.success(List.of());
        }

        List<String> courseIds = enrollments.stream().map(CourseEnrollment::getCourseId).toList();
        Map<String, Course> courseMap = courseRepository.findAllById(courseIds).stream()
                .collect(Collectors.toMap(Course::getId, c -> c));

        List<StudentEnrolledCourseDto> result = enrollments.stream()
                .filter(e -> courseMap.containsKey(e.getCourseId()))
                .map(e -> {
                    Course c = courseMap.get(e.getCourseId());
                    return StudentEnrolledCourseDto.builder()
                            .id(c.getId())
                            .enrollmentId(e.getId())
                            .courseId(c.getId())
                            .code(c.getCode())
                            .name(c.getName())
                            .creditHours(c.getCreditHours())
                            .semester(c.getSemester())
                            .academicTermId(e.getAcademicTermId())
                            .status(e.getStatus())
                            .enrollmentDate(e.getEnrollmentDate())
                            .build();
                })
                .toList();

        return ApiResponse.success(result);
    }

    @PostMapping("/me/courses/{courseId}/enroll")
    @PreAuthorize("isAuthenticated()")
    @Transactional
    @Operation(summary = "Authoritatively enroll currently authenticated student into a course")
    public ApiResponse<StudentEnrolledCourseDto> enrollInCourse(@PathVariable String courseId) {
        String institutionId = SecurityUtils.getCurrentInstitutionId();
        String currentUserId = SecurityUtils.getCurrentUserId();

        Student student = studentRepository.findByInstitutionIdAndUserId(institutionId, currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("No student profile linked to your account"));

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found: " + courseId));

        // Validate that course belongs to student's program
        if (student.getProgramId() == null || !student.getProgramId().equals(course.getProgramId())) {
            throw new BusinessRuleException("Cannot enroll in a course outside your academic program");
        }

        // Determine authoritative current active academic term
        String termId = student.getCurrentTermId();
        if (termId == null || termId.isBlank()) {
            AcademicTerm activeTerm = academicTermService.getCurrentActiveTerm(institutionId);
            termId = activeTerm.getId();
        }

        // Authoritative term-aware unique enrollment identity: studentId + courseId + academicTermId
        Optional<CourseEnrollment> existing = courseEnrollmentRepository.findByStudentIdAndCourseIdAndAcademicTermId(student.getId(), courseId, termId);
        CourseEnrollment enrollment;
        if (existing.isPresent()) {
            enrollment = existing.get();
            if ("ENROLLED".equalsIgnoreCase(enrollment.getStatus())) {
                throw new BusinessRuleException("Student is already enrolled in course " + course.getCode() + " for term " + termId);
            } else if ("COMPLETED".equalsIgnoreCase(enrollment.getStatus())) {
                throw new BusinessRuleException("Cannot re-enroll in course " + course.getCode() + " that has already been completed");
            }
            enrollment.setStatus("ENROLLED");
            enrollment.setEnrollmentDate(LocalDate.now());
            enrollment = courseEnrollmentRepository.save(enrollment);
        } else {
            CourseEnrollment newEnrollment = CourseEnrollment.builder()
                    .id("enr_" + UUID.randomUUID().toString().replace("-", "").substring(0, 16))
                    .studentId(student.getId())
                    .courseId(course.getId())
                    .academicTermId(termId)
                    .enrollmentDate(LocalDate.now())
                    .status("ENROLLED")
                    .build();
            try {
                enrollment = courseEnrollmentRepository.saveAndFlush(newEnrollment);
            } catch (DataIntegrityViolationException ex) {
                throw new BusinessRuleException("Concurrent enrollment detected: student already enrolled for this course and term");
            }
        }

        auditService.recordEvent(
                institutionId,
                currentUserId,
                student.getAdmissionNumber(),
                "COURSE_ENROLL",
                "COURSE_ENROLLMENT",
                enrollment.getId(),
                "SUCCESS",
                null, null, null,
                "Enrolled in course " + course.getCode() + " (" + course.getName() + ") for term " + termId,
                null, null
        );

        StudentEnrolledCourseDto dto = StudentEnrolledCourseDto.builder()
                .id(course.getId())
                .enrollmentId(enrollment.getId())
                .courseId(course.getId())
                .code(course.getCode())
                .name(course.getName())
                .creditHours(course.getCreditHours())
                .semester(course.getSemester())
                .academicTermId(enrollment.getAcademicTermId())
                .status(enrollment.getStatus())
                .enrollmentDate(enrollment.getEnrollmentDate())
                .build();

        return ApiResponse.success("Successfully enrolled in " + course.getCode(), dto);
    }

    @DeleteMapping("/me/courses/{courseId}/enroll")
    @PreAuthorize("isAuthenticated()")
    @Transactional
    @Operation(summary = "Drop a course enrollment for currently authenticated student")
    public ApiResponse<Void> dropCourse(@PathVariable String courseId) {
        String institutionId = SecurityUtils.getCurrentInstitutionId();
        String currentUserId = SecurityUtils.getCurrentUserId();

        Student student = studentRepository.findByInstitutionIdAndUserId(institutionId, currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("No student profile linked to your account"));

        // Determine authoritative current active academic term
        String termId = student.getCurrentTermId();
        if (termId == null || termId.isBlank()) {
            AcademicTerm activeTerm = academicTermService.getCurrentActiveTerm(institutionId);
            termId = activeTerm.getId();
        }

        // Strictly term-aware lookup: find enrollment for this specific course and current academic term ONLY
        CourseEnrollment enrollment = courseEnrollmentRepository
                .findByStudentIdAndCourseIdAndAcademicTermId(student.getId(), courseId, termId)
                .orElseThrow(() -> new ResourceNotFoundException("No active enrollment found for course " + courseId + " in current term " + termId));

        if ("DROPPED".equalsIgnoreCase(enrollment.getStatus())) {
            throw new BusinessRuleException("Course enrollment is already dropped for the current term");
        }
        if ("COMPLETED".equalsIgnoreCase(enrollment.getStatus())) {
            throw new BusinessRuleException("Cannot drop a course that has already been completed");
        }

        enrollment.setStatus("DROPPED");
        courseEnrollmentRepository.save(enrollment);

        auditService.recordEvent(
                institutionId,
                currentUserId,
                student.getAdmissionNumber(),
                "COURSE_DROP",
                "COURSE_ENROLLMENT",
                enrollment.getId(),
                "SUCCESS",
                null, null, null,
                "Dropped course " + courseId + " for term " + termId,
                null, null
        );

        return ApiResponse.success("Course enrollment dropped successfully", null);
    }

    @GetMapping("/me/fees")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get fee statement, balance and payment history for current logged-in student")
    public ApiResponse<Map<String, Object>> getMyFees() {
        String institutionId = SecurityUtils.getCurrentInstitutionId();
        String currentUserId = SecurityUtils.getCurrentUserId();

        Student student = studentRepository.findByInstitutionIdAndUserId(institutionId, currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("No student profile linked to your account"));

        List<Invoice> invoices = invoiceRepository.findByStudentId(student.getId());
        List<Payment> payments = paymentRepository.findByStudentId(student.getId());

        Map<String, Object> feeData = new HashMap<>();
        feeData.put("feeBalance", student.getFeeBalance());
        feeData.put("invoices", invoices);
        feeData.put("payments", payments);
        feeData.put("admissionNumber", student.getAdmissionNumber());
        feeData.put("studentName", student.getFullName());

        return ApiResponse.success(feeData);
    }

    @GetMapping("/me/results")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get academic exam results for current logged-in student")
    public ApiResponse<List<StudentMark>> getMyResults() {
        String institutionId = SecurityUtils.getCurrentInstitutionId();
        String currentUserId = SecurityUtils.getCurrentUserId();

        Student student = studentRepository.findByInstitutionIdAndUserId(institutionId, currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("No student profile linked to your account"));

        return ApiResponse.success(studentMarkRepository.findByStudentId(student.getId()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get single student with IDOR ownership validation")
    public ApiResponse<StudentResponseDto> getStudentById(@PathVariable String id) {
        String institutionId = SecurityUtils.getCurrentInstitutionId();
        CustomUserDetails currentUser = SecurityUtils.getCurrentUserDetails();

        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student record not found"));

        if (!institutionId.equals(student.getInstitutionId())) {
            throw new UnauthorizedException("Cross-tenant access denied to student record " + id);
        }

        // IDOR Protection: If student role, ensure caller owns this student record
        boolean isStaff = currentUser.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().startsWith("ROLE_ADMIN") ||
                               a.getAuthority().startsWith("ROLE_LECTURER") ||
                               a.getAuthority().startsWith("ROLE_FINANCE") ||
                               a.getAuthority().startsWith("ROLE_DEAN"));

        if (!isStaff && (student.getUserId() == null || !student.getUserId().equals(currentUser.getId()))) {
            throw new UnauthorizedException("IDOR Violation: Access denied to student record " + id);
        }

        return ApiResponse.success(toDto(student));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('STUDENT_EDIT') or hasRole('ADMIN')")
    @Operation(summary = "Create new student registry record")
    public ApiResponse<StudentResponseDto> createStudent(@RequestBody Student student) {
        String institutionId = SecurityUtils.getCurrentInstitutionId();
        student.setId("stu_" + UUID.randomUUID().toString().replace("-", "").substring(0, 16));
        student.setInstitutionId(institutionId);
        student.setCreatedAt(Instant.now());
        student.setUpdatedAt(Instant.now());

        Student saved = studentRepository.save(student);

        auditService.recordEvent(
                institutionId,
                SecurityUtils.getCurrentUserId(),
                SecurityUtils.getCurrentUserDetails().getIdentifier(),
                "STUDENT_CREATE",
                "STUDENT",
                saved.getId(),
                "SUCCESS",
                null, null, null,
                "Created student " + saved.getFullName() + " (" + saved.getAdmissionNumber() + ")",
                null, null
        );

        return ApiResponse.success("Student created successfully", toDto(saved));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('STUDENT_EDIT') or hasRole('ADMIN')")
    @Operation(summary = "Update student details")
    public ApiResponse<StudentResponseDto> updateStudent(@PathVariable String id, @RequestBody Student update) {
        String institutionId = SecurityUtils.getCurrentInstitutionId();
        Student student = studentRepository.findByInstitutionIdAndId(institutionId, id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));

        if (update.getFullName() != null) student.setFullName(update.getFullName());
        if (update.getPhoneNumber() != null) student.setPhoneNumber(update.getPhoneNumber());
        if (update.getEmail() != null) student.setEmail(update.getEmail());
        if (update.getGuardianName() != null) student.setGuardianName(update.getGuardianName());
        if (update.getGuardianPhone() != null) student.setGuardianPhone(update.getGuardianPhone());
        if (update.getStatus() != null) student.setStatus(update.getStatus());
        student.setUpdatedAt(Instant.now());

        Student saved = studentRepository.save(student);

        auditService.recordEvent(
                institutionId,
                SecurityUtils.getCurrentUserId(),
                SecurityUtils.getCurrentUserDetails().getIdentifier(),
                "STUDENT_UPDATE",
                "STUDENT",
                saved.getId(),
                "SUCCESS",
                null, null, null,
                "Updated details for student " + saved.getAdmissionNumber(),
                null, null
        );

        return ApiResponse.success("Student updated successfully", toDto(saved));
    }
}
