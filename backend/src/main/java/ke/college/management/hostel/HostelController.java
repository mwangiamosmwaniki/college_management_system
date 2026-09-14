package ke.college.management.hostel;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import ke.college.management.audit.AuditService;
import ke.college.management.common.ApiResponse;
import ke.college.management.exceptions.ResourceNotFoundException;
import ke.college.management.exceptions.UnauthorizedException;
import ke.college.management.hostel.entity.Hostel;
import ke.college.management.hostel.entity.HostelAllocation;
import ke.college.management.hostel.repository.HostelAllocationRepository;
import ke.college.management.hostel.repository.HostelRepository;
import ke.college.management.security.CustomUserDetails;
import ke.college.management.security.SecurityUtils;
import ke.college.management.students.entity.Student;
import ke.college.management.students.repository.StudentRepository;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/hostels")
@RequiredArgsConstructor
@Tag(name = "Hostels", description = "Hostel management, room bed spaces and student accommodation allocation")
public class HostelController {

    private final HostelRepository hostelRepository;
    private final HostelAllocationRepository hostelAllocationRepository;
    private final StudentRepository studentRepository;
    private final AuditService auditService;

    @GetMapping
    @Operation(summary = "Get list of hostels")
    public ApiResponse<List<Hostel>> getHostels() {
        return ApiResponse.success(hostelRepository.findByInstitutionId(SecurityUtils.getCurrentInstitutionId()));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('HOSTEL_MANAGE') or hasRole('ADMIN')")
    @Operation(summary = "Create new hostel facility")
    public ApiResponse<Hostel> createHostel(@RequestBody Hostel hostel) {
        hostel.setId("hst_" + UUID.randomUUID().toString().replace("-", "").substring(0, 16));
        hostel.setInstitutionId(SecurityUtils.getCurrentInstitutionId());
        hostel.setCreatedAt(Instant.now());
        Hostel saved = hostelRepository.save(hostel);
        return ApiResponse.success("Hostel created successfully", saved);
    }

    @PostMapping("/allocate")
    @PreAuthorize("hasAuthority('HOSTEL_MANAGE') or hasRole('ADMIN')")
    @Transactional
    @Operation(summary = "Allocate hostel accommodation bed to student")
    public ApiResponse<HostelAllocation> allocateBed(@RequestBody AllocationRequest request) {
        String institutionId = SecurityUtils.getCurrentInstitutionId();

        HostelAllocation allocation = HostelAllocation.builder()
                .id("hal_" + UUID.randomUUID().toString().replace("-", "").substring(0, 16))
                .institutionId(institutionId)
                .bedId(request.getBedId())
                .studentId(request.getStudentId())
                .academicTermId(request.getAcademicTermId())
                .status("ACTIVE")
                .allocatedAt(Instant.now())
                .checkedInAt(Instant.now())
                .build();

        HostelAllocation saved = hostelAllocationRepository.save(allocation);
        return ApiResponse.success("Accommodation allocated successfully", saved);
    }

    @PostMapping("/allocations/{id}/checkout")
    @PreAuthorize("hasAuthority('HOSTEL_MANAGE') or hasRole('ADMIN')")
    @Transactional
    @Operation(summary = "Process student checkout and clearance from hostel")
    public ApiResponse<HostelAllocation> checkout(@PathVariable String id) {
        HostelAllocation allocation = hostelAllocationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Hostel allocation not found"));

        allocation.setStatus("CHECKED_OUT");
        allocation.setCheckedOutAt(Instant.now());
        HostelAllocation saved = hostelAllocationRepository.save(allocation);
        return ApiResponse.success("Student checked out from accommodation", saved);
    }

    @GetMapping("/allocations/me")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get accommodation allocations for currently authenticated student")
    public ApiResponse<List<HostelAllocation>> getMyAllocations() {
        String userId = SecurityUtils.getCurrentUserId();
        String institutionId = SecurityUtils.getCurrentInstitutionId();
        Student student = studentRepository.findByInstitutionIdAndUserId(institutionId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found for user"));
        return ApiResponse.success(hostelAllocationRepository.findByStudentId(student.getId()));
    }

    @GetMapping("/allocations/student/{studentId}")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get accommodation allocations for student")
    public ApiResponse<List<HostelAllocation>> getStudentAllocations(@PathVariable String studentId) {
        CustomUserDetails currentUser = SecurityUtils.getCurrentUserDetails();
        boolean isStaff = currentUser.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN") ||
                               a.getAuthority().equals("HOSTEL_MANAGE") ||
                               a.getAuthority().equals("ROLE_WARDEN"));

        if (!isStaff) {
            Student student = studentRepository.findByInstitutionIdAndUserId(
                    SecurityUtils.getCurrentInstitutionId(), currentUser.getId()
            ).orElseThrow(() -> new UnauthorizedException("Student profile required"));
            if (!student.getId().equals(studentId)) {
                throw new UnauthorizedException("IDOR Violation: Access denied to other student hostel allocations");
            }
        }
        return ApiResponse.success(hostelAllocationRepository.findByStudentId(studentId));
    }

    @Data
    public static class AllocationRequest {
        private String bedId;
        private String studentId;
        private String academicTermId;
    }
}
