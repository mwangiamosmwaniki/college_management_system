package ke.college.management.lms;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import ke.college.management.audit.AuditService;
import ke.college.management.common.ApiResponse;
import ke.college.management.exceptions.BadRequestException;
import ke.college.management.exceptions.ResourceNotFoundException;
import ke.college.management.exceptions.UnauthorizedException;
import ke.college.management.lms.entity.LmsAssignment;
import ke.college.management.lms.entity.LmsSubmission;
import ke.college.management.lms.repository.LmsAssignmentRepository;
import ke.college.management.lms.repository.LmsSubmissionRepository;
import ke.college.management.security.CustomUserDetails;
import ke.college.management.security.SecurityUtils;
import ke.college.management.students.entity.Student;
import ke.college.management.students.repository.StudentRepository;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/lms")
@RequiredArgsConstructor
@Tag(name = "LMS & Assignments", description = "Learning management system, assignments, student submissions and grading")
public class LmsController {

    private final LmsAssignmentRepository assignmentRepository;
    private final LmsSubmissionRepository submissionRepository;
    private final StudentRepository studentRepository;
    private final AuditService auditService;

    @GetMapping("/assignments/course/{courseId}")
    @Operation(summary = "Get assignments for course")
    public ApiResponse<List<LmsAssignment>> getAssignments(@PathVariable String courseId) {
        return ApiResponse.success(assignmentRepository.findByCourseId(courseId));
    }

    @PostMapping("/assignments")
    @PreAuthorize("hasAuthority('COURSE_EDIT') or hasRole('LECTURER') or hasRole('ADMIN')")
    @Operation(summary = "Create course assignment with deadline")
    public ApiResponse<LmsAssignment> createAssignment(@RequestBody LmsAssignment assignment) {
        assignment.setId("asg_" + UUID.randomUUID().toString().replace("-", "").substring(0, 16));
        assignment.setCreatedAt(Instant.now());
        LmsAssignment saved = assignmentRepository.save(assignment);
        return ApiResponse.success("Assignment created successfully", saved);
    }

    @GetMapping("/assignments/{assignmentId}/my-submission")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get current student submission for assignment")
    public ApiResponse<LmsSubmission> getMySubmission(@PathVariable String assignmentId) {
        String userId = SecurityUtils.getCurrentUserId();
        String institutionId = SecurityUtils.getCurrentInstitutionId();
        Student student = studentRepository.findByInstitutionIdAndUserId(institutionId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));

        LmsSubmission submission = submissionRepository.findByAssignmentIdAndStudentId(assignmentId, student.getId())
                .orElse(null);
        return ApiResponse.success(submission);
    }

    @PostMapping("/assignments/{assignmentId}/submit")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Submit assignment response")
    public ApiResponse<LmsSubmission> submitAssignment(
            @PathVariable String assignmentId,
            @RequestBody SubmitRequest request
    ) {
        LmsAssignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Assignment not found"));

        CustomUserDetails currentUser = SecurityUtils.getCurrentUserDetails();
        String targetStudentId = request.getStudentId();

        // Enforce that a student can only submit for themselves
        boolean isStaff = currentUser.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN") || a.getAuthority().equals("ROLE_LECTURER"));

        if (!isStaff) {
            Student student = studentRepository.findByInstitutionIdAndUserId(
                    SecurityUtils.getCurrentInstitutionId(), currentUser.getId()
            ).orElseThrow(() -> new UnauthorizedException("Student profile required for assignment submission"));
            targetStudentId = student.getId();
        }

        boolean isLate = Instant.now().isAfter(assignment.getDueDate());

        LmsSubmission submission = submissionRepository.findByAssignmentIdAndStudentId(assignmentId, targetStudentId)
                .orElse(LmsSubmission.builder()
                        .id("sub_" + UUID.randomUUID().toString().replace("-", "").substring(0, 16))
                        .assignmentId(assignmentId)
                        .studentId(targetStudentId)
                        .build());

        submission.setSubmissionText(request.getSubmissionText());
        submission.setSubmittedAt(Instant.now());
        submission.setStatus(isLate ? "LATE" : "SUBMITTED");

        LmsSubmission saved = submissionRepository.save(submission);
        return ApiResponse.success(isLate ? "Assignment submitted (marked LATE)" : "Assignment submitted successfully", saved);
    }

    @GetMapping("/assignments/{assignmentId}/submissions")
    @PreAuthorize("hasRole('LECTURER') or hasRole('ADMIN')")
    @Operation(summary = "Get student submissions for assignment")
    public ApiResponse<List<LmsSubmission>> getSubmissions(@PathVariable String assignmentId) {
        return ApiResponse.success(submissionRepository.findByAssignmentId(assignmentId));
    }

    @PostMapping("/submissions/{submissionId}/grade")
    @PreAuthorize("hasAuthority('MARK_ENTER') or hasRole('LECTURER') or hasRole('ADMIN')")
    @Operation(summary = "Grade student submission")
    public ApiResponse<LmsSubmission> gradeSubmission(
            @PathVariable String submissionId,
            @RequestBody GradeRequest request
    ) {
        LmsSubmission submission = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new ResourceNotFoundException("Submission not found"));

        submission.setScore(request.getScore());
        submission.setFeedback(request.getFeedback());
        submission.setGradedBy(SecurityUtils.getCurrentUserId());
        submission.setStatus("GRADED");

        LmsSubmission saved = submissionRepository.save(submission);
        return ApiResponse.success("Submission graded", saved);
    }

    @GetMapping("/submissions/student/{studentId}")
    @Operation(summary = "Get submissions for student")
    public ApiResponse<List<LmsSubmission>> getStudentSubmissions(@PathVariable String studentId) {
        return ApiResponse.success(submissionRepository.findByStudentId(studentId));
    }

    @Data
    public static class SubmitRequest {
        private String studentId;
        private String submissionText;
    }

    @Data
    public static class GradeRequest {
        private BigDecimal score;
        private String feedback;
    }
}
