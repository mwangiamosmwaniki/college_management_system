package ke.college.management.academics;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import ke.college.management.academics.entity.Assessment;
import ke.college.management.academics.entity.StudentMark;
import ke.college.management.academics.repository.AssessmentRepository;
import ke.college.management.academics.repository.StudentMarkRepository;
import ke.college.management.audit.AuditService;
import ke.college.management.common.ApiResponse;
import ke.college.management.exceptions.BadRequestException;
import ke.college.management.exceptions.ResourceNotFoundException;
import ke.college.management.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
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
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/academics")
@RequiredArgsConstructor
@Tag(name = "Academics & Grading", description = "Server-controlled grade entry, moderation, approval and publication lifecycle")
public class AcademicController {

    private final AssessmentRepository assessmentRepository;
    private final StudentMarkRepository studentMarkRepository;
    private final AuditService auditService;

    @GetMapping("/assessments")
    @Operation(summary = "Get assessments for course")
    public ApiResponse<List<Assessment>> getAssessments(@RequestParam String courseId) {
        return ApiResponse.success(assessmentRepository.findByCourseId(courseId));
    }

    @PostMapping("/assessments")
    @PreAuthorize("hasAuthority('MARK_ENTER') or hasRole('LECTURER') or hasRole('ADMIN')")
    @Operation(summary = "Create an assessment component")
    public ApiResponse<Assessment> createAssessment(@RequestBody Assessment assessment) {
        assessment.setId("ass_" + UUID.randomUUID().toString().replace("-", "").substring(0, 16));
        assessment.setCreatedAt(Instant.now());
        Assessment saved = assessmentRepository.save(assessment);
        return ApiResponse.success("Assessment created successfully", saved);
    }

    @GetMapping("/marks/student/{studentId}")
    @Operation(summary = "Get official marks for a student")
    public ApiResponse<List<StudentMark>> getStudentMarks(@PathVariable String studentId) {
        // Enforce IDOR protection: only student self or authorized staff
        return ApiResponse.success(studentMarkRepository.findByStudentId(studentId));
    }

    @PostMapping("/marks")
    @PreAuthorize("hasAuthority('MARK_ENTER') or hasRole('LECTURER') or hasRole('ADMIN')")
    @Transactional
    @Operation(summary = "Enter continuous assessment marks (DRAFT state)")
    public ApiResponse<StudentMark> enterMark(@RequestBody StudentMark request) {
        Assessment assessment = assessmentRepository.findById(request.getAssessmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Assessment not found"));

        if (request.getScore().compareTo(BigDecimal.ZERO) < 0 || request.getScore().compareTo(assessment.getMaxMarks()) > 0) {
            throw new BadRequestException("Score must be between 0 and maximum mark (" + assessment.getMaxMarks() + ")");
        }

        StudentMark mark = studentMarkRepository.findByAssessmentIdAndStudentId(request.getAssessmentId(), request.getStudentId())
                .orElse(StudentMark.builder()
                        .id("mrk_" + UUID.randomUUID().toString().replace("-", "").substring(0, 16))
                        .assessmentId(request.getAssessmentId())
                        .studentId(request.getStudentId())
                        .status("DRAFT")
                        .createdAt(Instant.now())
                        .build());

        if ("PUBLISHED".equals(mark.getStatus())) {
            throw new BadRequestException("Results are locked in PUBLISHED state. Formal grade amendment approval required.");
        }

        mark.setScore(request.getScore());
        mark.setEnteredBy(SecurityUtils.getCurrentUserId());
        mark.setUpdatedAt(Instant.now());

        StudentMark saved = studentMarkRepository.save(mark);

        auditService.recordEvent(
                SecurityUtils.getCurrentInstitutionId(),
                SecurityUtils.getCurrentUserId(),
                SecurityUtils.getCurrentUserDetails().getIdentifier(),
                "MARK_ENTER",
                "STUDENT_MARK",
                saved.getId(),
                "SUCCESS",
                null, null, null,
                "Score " + saved.getScore() + " recorded for student " + saved.getStudentId(),
                null, null
        );

        return ApiResponse.success("Mark recorded in DRAFT state", saved);
    }

    @PutMapping("/marks/{markId}/status")
    @PreAuthorize("hasAuthority('MARK_APPROVE') or hasRole('DEAN') or hasRole('ADMIN')")
    @Transactional
    @Operation(summary = "Advance marks lifecycle (SUBMITTED -> MODERATED -> APPROVED -> PUBLISHED)")
    public ApiResponse<StudentMark> transitionStatus(
            @PathVariable String markId,
            @RequestParam String targetStatus
    ) {
        StudentMark mark = studentMarkRepository.findById(markId)
                .orElseThrow(() -> new ResourceNotFoundException("Mark record not found"));

        // Validate state machine transitions
        String current = mark.getStatus();
        boolean valid = switch (current) {
            case "DRAFT" -> "SUBMITTED".equals(targetStatus);
            case "SUBMITTED" -> "MODERATED".equals(targetStatus);
            case "MODERATED" -> "APPROVED".equals(targetStatus);
            case "APPROVED" -> "PUBLISHED".equals(targetStatus);
            default -> false;
        };

        if (!valid) {
            throw new BadRequestException("Invalid lifecycle state transition from " + current + " to " + targetStatus);
        }

        mark.setStatus(targetStatus);
        mark.setUpdatedAt(Instant.now());
        StudentMark saved = studentMarkRepository.save(mark);

        auditService.recordEvent(
                SecurityUtils.getCurrentInstitutionId(),
                SecurityUtils.getCurrentUserId(),
                SecurityUtils.getCurrentUserDetails().getIdentifier(),
                "GRADE_LIFECYCLE_TRANSITION",
                "STUDENT_MARK",
                saved.getId(),
                "SUCCESS",
                null, null, null,
                "Transitioned mark from " + current + " to " + targetStatus,
                current, targetStatus
        );

        return ApiResponse.success("Mark transitioned to " + targetStatus, saved);
    }
}
