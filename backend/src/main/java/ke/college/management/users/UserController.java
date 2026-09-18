package ke.college.management.users;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import ke.college.management.audit.AuditService;
import ke.college.management.auth.AuthService;
import ke.college.management.auth.dto.PortalAssignmentDto;
import ke.college.management.auth.dto.UserDto;
import ke.college.management.common.ApiResponse;
import ke.college.management.common.PageResponse;
import ke.college.management.exceptions.BadRequestException;
import ke.college.management.exceptions.ResourceNotFoundException;
import ke.college.management.exceptions.UnauthorizedException;
import ke.college.management.security.CustomUserDetails;
import ke.college.management.security.SecurityUtils;
import ke.college.management.users.entity.Role;
import ke.college.management.users.entity.User;
import ke.college.management.users.entity.UserPortalAssignment;
import ke.college.management.users.repository.RoleRepository;
import ke.college.management.users.repository.UserPortalAssignmentRepository;
import ke.college.management.users.repository.UserRepository;
import lombok.RequiredArgsConstructor;
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
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@Tag(name = "Users & Access Control", description = "Server-enforced user management and RBAC")
public class UserController {

    private final UserRepository userRepository;
    private final UserPortalAssignmentRepository userPortalAssignmentRepository;
    private final RoleRepository roleRepository;
    private final AuditService auditService;
    private final AuthService authService;

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

        Page<UserDto> dtoPage = userPage.map(u -> {
            List<String> roles = u.getRoles().stream().map(Role::getCode).toList();
            List<PortalAssignmentDto> assignments = authService.getActivePortalAssignments(u.getId());
            List<String> allowedPortals = assignments.stream().map(PortalAssignmentDto::getPortalId).distinct().toList();
            String defaultPortal = authService.resolveAndValidateDefaultPortal(u, assignments);
            return UserDto.builder()
                .id(u.getId())
                .identifier(u.getIdentifier())
                .email(u.getEmail())
                .fullName(u.getFullName())
                .institutionId(u.getInstitutionId())
                .departmentId(u.getDepartmentId())
                .campusId(u.getCampusId())
                .status(u.getStatus())
                .roles(roles)
                .permissions(u.getRoles().stream().flatMap(r -> r.getPermissions().stream()).map(p -> p.getCode()).distinct().toList())
                .portalAssignments(assignments)
                .allowedPortalIds(allowedPortals)
                .defaultPortalId(defaultPortal)
                .build();
        });

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
                "Status changed from " + previousStatus + " to " + status.toUpperCase(),
                previousStatus, status.toUpperCase()
        );

        List<PortalAssignmentDto> assignments = authService.getActivePortalAssignments(saved.getId());
        List<String> allowedPortals = assignments.stream().map(PortalAssignmentDto::getPortalId).distinct().toList();
        String defaultPortal = authService.resolveAndValidateDefaultPortal(saved, assignments);

        return ApiResponse.success("User status updated successfully", UserDto.builder()
                .id(saved.getId())
                .identifier(saved.getIdentifier())
                .email(saved.getEmail())
                .fullName(saved.getFullName())
                .institutionId(saved.getInstitutionId())
                .status(saved.getStatus())
                .roles(saved.getRoles().stream().map(Role::getCode).toList())
                .portalAssignments(assignments)
                .allowedPortalIds(allowedPortals)
                .defaultPortalId(defaultPortal)
                .build());
    }

    @PutMapping("/{id}/default-portal")
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    @Operation(summary = "Update user default portal (authorized administrator only)")
    public ApiResponse<UserDto> updateUserDefaultPortal(
            @PathVariable String id,
            @RequestParam String portalId
    ) {
        String institutionId = SecurityUtils.getCurrentInstitutionId();
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        SecurityUtils.validateTenantAccess(user.getInstitutionId());

        String normPortal = portalId.trim().toUpperCase();
        List<String> roles = user.getRoles().stream().map(Role::getCode).toList();
        List<PortalAssignmentDto> assignments = authService.getActivePortalAssignments(user.getId());
        boolean isAuthorized = assignments.stream()
                .anyMatch(a -> a.getPortalId().equalsIgnoreCase(normPortal));

        if (!isAuthorized) {
            throw new BadRequestException("Requested default portal is not among user's authorized portal assignments");
        }

        // Atomically unset existing defaults to maintain one active default per user & institution
        userPortalAssignmentRepository.unsetAllDefaultsForUser(user.getId(), user.getInstitutionId());
        userPortalAssignmentRepository.findByUserIdAndPortalId(user.getId(), normPortal)
                .ifPresent(a -> {
                    a.setIsDefault(true);
                    a.setUpdatedAt(Instant.now());
                    userPortalAssignmentRepository.save(a);
                });

        String prev = user.getDefaultPortalId();
        user.setDefaultPortalId(normPortal);
        user.setUpdatedAt(Instant.now());
        User saved = userRepository.save(user);

        auditService.recordEvent(
                institutionId,
                SecurityUtils.getCurrentUserId(),
                SecurityUtils.getCurrentUserDetails().getIdentifier(),
                "USER_DEFAULT_PORTAL_CHANGE",
                "USER",
                saved.getId(),
                "SUCCESS",
                null, null, null,
                "Changed default portal of " + saved.getEmail() + " to " + normPortal,
                prev, normPortal
        );

        List<PortalAssignmentDto> refreshedAssignments = authService.getActivePortalAssignments(saved.getId());
        return ApiResponse.success("Default portal updated successfully", UserDto.builder()
                .id(saved.getId())
                .identifier(saved.getIdentifier())
                .email(saved.getEmail())
                .fullName(saved.getFullName())
                .institutionId(saved.getInstitutionId())
                .status(saved.getStatus())
                .roles(roles)
                .portalAssignments(refreshedAssignments)
                .allowedPortalIds(refreshedAssignments.stream().map(PortalAssignmentDto::getPortalId).distinct().toList())
                .defaultPortalId(saved.getDefaultPortalId())
                .build());
    }

    @PutMapping("/me/default-portal")
    @PreAuthorize("isAuthenticated()")
    @Transactional
    @Operation(summary = "Update authenticated user's own preferred default portal")
    public ApiResponse<UserDto> updateMyDefaultPortal(@RequestParam String portalId) {
        String institutionId = SecurityUtils.getCurrentInstitutionId();
        String currentUserId = SecurityUtils.getCurrentUserId();
        User user = userRepository.findById(currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        String normPortal = portalId.trim().toUpperCase();
        List<String> roles = user.getRoles().stream().map(Role::getCode).toList();
        List<PortalAssignmentDto> assignments = authService.getActivePortalAssignments(user.getId());
        boolean isAuthorized = assignments.stream()
                .anyMatch(a -> a.getPortalId().equalsIgnoreCase(normPortal));

        if (!isAuthorized) {
            throw new BadRequestException("Requested default portal is not among your authorized portal assignments");
        }

        // Atomically unset existing defaults to maintain one active default per user & institution
        userPortalAssignmentRepository.unsetAllDefaultsForUser(user.getId(), user.getInstitutionId());
        userPortalAssignmentRepository.findByUserIdAndPortalId(user.getId(), normPortal)
                .ifPresent(a -> {
                    a.setIsDefault(true);
                    a.setUpdatedAt(Instant.now());
                    userPortalAssignmentRepository.save(a);
                });

        String prev = user.getDefaultPortalId();
        user.setDefaultPortalId(normPortal);
        user.setUpdatedAt(Instant.now());
        User saved = userRepository.save(user);

        auditService.recordEvent(
                institutionId,
                currentUserId,
                user.getIdentifier(),
                "USER_SELF_DEFAULT_PORTAL_CHANGE",
                "USER",
                saved.getId(),
                "SUCCESS",
                null, null, null,
                "User changed preferred default portal to " + normPortal,
                prev, normPortal
        );

        List<PortalAssignmentDto> refreshedAssignments = authService.getActivePortalAssignments(saved.getId());
        return ApiResponse.success("Preferred default portal updated successfully", UserDto.builder()
                .id(saved.getId())
                .identifier(saved.getIdentifier())
                .email(saved.getEmail())
                .fullName(saved.getFullName())
                .institutionId(saved.getInstitutionId())
                .status(saved.getStatus())
                .roles(roles)
                .portalAssignments(refreshedAssignments)
                .allowedPortalIds(refreshedAssignments.stream().map(PortalAssignmentDto::getPortalId).distinct().toList())
                .defaultPortalId(saved.getDefaultPortalId())
                .build());
    }

    @PostMapping("/{id}/portal-assignments")
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    @Operation(summary = "Assign a portal to a user (administrator only)")
    public ApiResponse<UserDto> assignPortalToUser(
            @PathVariable String id,
            @RequestParam String portalId,
            @RequestParam(required = false) String roleId,
            @RequestParam(defaultValue = "false") boolean isDefault
    ) {
        String institutionId = SecurityUtils.getCurrentInstitutionId();
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        SecurityUtils.validateTenantAccess(user.getInstitutionId());

        String normPortal = portalId.trim().toUpperCase();

        if (isDefault) {
            userPortalAssignmentRepository.unsetAllDefaultsForUser(user.getId(), user.getInstitutionId());
        }

        UserPortalAssignment assignment = userPortalAssignmentRepository
                .findByUserIdAndPortalId(user.getId(), normPortal)
                .orElseGet(() -> UserPortalAssignment.builder()
                        .id("upa_" + UUID.randomUUID().toString().replace("-", "").substring(0, 16))
                        .user(user)
                        .portalId(normPortal)
                        .institutionId(user.getInstitutionId())
                        .build());

        if (roleId != null && !roleId.isBlank()) {
            Role role = roleRepository.findById(roleId).orElse(null);
            assignment.setRole(role);
        }

        assignment.setActive(true);
        assignment.setRevokedAt(null);
        assignment.setIsDefault(isDefault);
        assignment.setAssignedAt(Instant.now());
        assignment.setUpdatedAt(Instant.now());
        userPortalAssignmentRepository.save(assignment);

        if (isDefault) {
            user.setDefaultPortalId(normPortal);
            userRepository.save(user);
        }

        auditService.recordEvent(
                institutionId,
                SecurityUtils.getCurrentUserId(),
                SecurityUtils.getCurrentUserDetails().getIdentifier(),
                "USER_PORTAL_ASSIGNED",
                "USER_PORTAL_ASSIGNMENT",
                assignment.getId(),
                "SUCCESS",
                null, null, null,
                "Assigned portal " + normPortal + " to user " + user.getEmail(),
                null, normPortal
        );

        List<PortalAssignmentDto> assignments = authService.getActivePortalAssignments(user.getId());
        return ApiResponse.success("Portal assigned successfully", UserDto.builder()
                .id(user.getId())
                .identifier(user.getIdentifier())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .institutionId(user.getInstitutionId())
                .status(user.getStatus())
                .roles(user.getRoles().stream().map(Role::getCode).toList())
                .portalAssignments(assignments)
                .allowedPortalIds(assignments.stream().map(PortalAssignmentDto::getPortalId).distinct().toList())
                .defaultPortalId(user.getDefaultPortalId())
                .build());
    }

    @DeleteMapping("/{id}/portal-assignments/{portalId}")
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    @Operation(summary = "Revoke a portal assignment from a user with immediate effect")
    public ApiResponse<UserDto> revokePortalFromUser(
            @PathVariable String id,
            @PathVariable String portalId
    ) {
        String institutionId = SecurityUtils.getCurrentInstitutionId();
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        SecurityUtils.validateTenantAccess(user.getInstitutionId());

        String normPortal = portalId.trim().toUpperCase();
        UserPortalAssignment assignment = userPortalAssignmentRepository
                .findByUserIdAndPortalId(user.getId(), normPortal)
                .orElseThrow(() -> new ResourceNotFoundException("Assignment for portal " + normPortal + " not found"));

        assignment.setActive(false);
        assignment.setRevokedAt(Instant.now());
        assignment.setIsDefault(false);
        assignment.setUpdatedAt(Instant.now());
        userPortalAssignmentRepository.save(assignment);

        // If the revoked portal was the user's default, recalculate default
        List<PortalAssignmentDto> remaining = authService.getActivePortalAssignments(user.getId());
        String repairedDefault = authService.resolveAndValidateDefaultPortal(user, remaining);
        user.setDefaultPortalId(repairedDefault);
        userRepository.save(user);

        auditService.recordEvent(
                institutionId,
                SecurityUtils.getCurrentUserId(),
                SecurityUtils.getCurrentUserDetails().getIdentifier(),
                "USER_PORTAL_REVOKED",
                "USER_PORTAL_ASSIGNMENT",
                assignment.getId(),
                "SUCCESS",
                null, null, null,
                "Revoked portal " + normPortal + " from user " + user.getEmail(),
                normPortal, null
        );

        return ApiResponse.success("Portal access revoked successfully", UserDto.builder()
                .id(user.getId())
                .identifier(user.getIdentifier())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .institutionId(user.getInstitutionId())
                .status(user.getStatus())
                .roles(user.getRoles().stream().map(Role::getCode).toList())
                .portalAssignments(remaining)
                .allowedPortalIds(remaining.stream().map(PortalAssignmentDto::getPortalId).distinct().toList())
                .defaultPortalId(user.getDefaultPortalId())
                .build());
    }
}
