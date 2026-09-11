package ke.college.management.users;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import ke.college.management.audit.AuditService;
import ke.college.management.auth.AuthService;
import ke.college.management.auth.dto.UserDto;
import ke.college.management.common.ApiResponse;
import ke.college.management.common.PageResponse;
import ke.college.management.exceptions.ResourceNotFoundException;
import ke.college.management.exceptions.UnauthorizedException;
import ke.college.management.security.CustomUserDetails;
import ke.college.management.security.SecurityUtils;
import ke.college.management.users.entity.User;
import ke.college.management.users.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@Tag(name = "Users & Access Control", description = "Server-enforced user management and RBAC")
public class UserController {

    private final UserRepository userRepository;
    private final AuditService auditService;

    @GetMapping
    @PreAuthorize("hasAuthority('USER_VIEW') or hasRole('ADMIN')")
    @Operation(summary = "Get paginated user list with institutional filtering and search")
    public ApiResponse<PageResponse<UserDto>> getUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String search
    ) {
        String institutionId = SecurityUtils.getCurrentInstitutionId();
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by("fullName").ascending());

        Page<User> userPage = (search != null && !search.isBlank())
                ? userRepository.searchUsers(institutionId, search.trim(), pageRequest)
                : userRepository.findByInstitutionId(institutionId, pageRequest);

        Page<UserDto> dtoPage = userPage.map(u -> UserDto.builder()
                .id(u.getId())
                .identifier(u.getIdentifier())
                .email(u.getEmail())
                .fullName(u.getFullName())
                .institutionId(u.getInstitutionId())
                .departmentId(u.getDepartmentId())
                .campusId(u.getCampusId())
                .status(u.getStatus())
                .roles(u.getRoles().stream().map(r -> r.getCode()).toList())
                .permissions(u.getRoles().stream().flatMap(r -> r.getPermissions().stream()).map(p -> p.getCode()).distinct().toList())
                .build());

        return ApiResponse.success(PageResponse.from(dtoPage));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update user account status (ACTIVE, SUSPENDED, INACTIVE)")
    public ApiResponse<UserDto> updateUserStatus(
            @PathVariable String id,
            @RequestParam String status
    ) {
        String institutionId = SecurityUtils.getCurrentInstitutionId();
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        SecurityUtils.validateTenantAccess(user.getInstitutionId());

        String previousStatus = user.getStatus();
        user.setStatus(status.toUpperCase());
        user.setUpdatedAt(Instant.now());
        User saved = userRepository.save(user);

        auditService.recordEvent(
                institutionId,
                SecurityUtils.getCurrentUserId(),
                SecurityUtils.getCurrentUserDetails().getIdentifier(),
                "USER_STATUS_CHANGE",
                "USER",
                saved.getId(),
                "SUCCESS",
                null, null, null,
                "Changed account status of " + saved.getEmail() + " to " + status,
                previousStatus, status
        );

        return ApiResponse.success("Status updated to " + status, UserDto.builder()
                .id(saved.getId())
                .identifier(saved.getIdentifier())
                .email(saved.getEmail())
                .fullName(saved.getFullName())
                .institutionId(saved.getInstitutionId())
                .status(saved.getStatus())
                .roles(saved.getRoles().stream().map(r -> r.getCode()).toList())
                .build());
    }
}
