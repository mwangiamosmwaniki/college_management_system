package ke.college.management.students;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import ke.college.management.audit.AuditService;
import ke.college.management.common.ApiResponse;
import ke.college.management.common.PageResponse;
import ke.college.management.exceptions.ResourceNotFoundException;
import ke.college.management.exceptions.UnauthorizedException;
import ke.college.management.security.CustomUserDetails;
import ke.college.management.security.SecurityUtils;
import ke.college.management.students.entity.Student;
import ke.college.management.students.repository.StudentRepository;
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
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/students")
@RequiredArgsConstructor
@Tag(name = "Students", description = "Student registries, profiles and enrollment")
public class StudentController {

    private final StudentRepository studentRepository;
    private final AuditService auditService;

    @GetMapping
    @PreAuthorize("hasAuthority('STUDENT_VIEW') or hasRole('ADMIN') or hasRole('LECTURER') or hasRole('FINANCE')")
    @Operation(summary = "Paginated student list with search and tenant isolation")
    public ApiResponse<PageResponse<Student>> getStudents(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String search
    ) {
        String institutionId = SecurityUtils.getCurrentInstitutionId();
        PageRequest pageable = PageRequest.of(page, size, Sort.by("admissionNumber").ascending());

        Page<Student> studentPage = (search != null && !search.isBlank())
                ? studentRepository.searchStudents(institutionId, search.trim(), pageable)
                : studentRepository.findByInstitutionId(institutionId, pageable);

        return ApiResponse.success(PageResponse.from(studentPage));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get single student with IDOR ownership validation")
    public ApiResponse<Student> getStudentById(@PathVariable String id) {
        String institutionId = SecurityUtils.getCurrentInstitutionId();
        CustomUserDetails currentUser = SecurityUtils.getCurrentUserDetails();

        Student student = studentRepository.findByInstitutionIdAndId(institutionId, id)
                .orElseThrow(() -> new ResourceNotFoundException("Student record not found"));

        // IDOR Protection: If student role, ensure caller owns this student record
        boolean isStaff = currentUser.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().startsWith("ROLE_ADMIN") ||
                               a.getAuthority().startsWith("ROLE_LECTURER") ||
                               a.getAuthority().startsWith("ROLE_FINANCE") ||
                               a.getAuthority().startsWith("ROLE_DEAN"));

        if (!isStaff && !student.getUserId().equals(currentUser.getId())) {
            throw new UnauthorizedException("IDOR Violation: Access denied to student record " + id);
        }

        return ApiResponse.success(student);
    }

    @PostMapping
    @PreAuthorize("hasAuthority('STUDENT_EDIT') or hasRole('ADMIN')")
    @Operation(summary = "Create new student registry record")
    public ApiResponse<Student> createStudent(@RequestBody Student student) {
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

        return ApiResponse.success("Student created successfully", saved);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('STUDENT_EDIT') or hasRole('ADMIN')")
    @Operation(summary = "Update student details")
    public ApiResponse<Student> updateStudent(@PathVariable String id, @RequestBody Student update) {
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

        return ApiResponse.success("Student updated successfully", saved);
    }
}
