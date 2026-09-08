package ke.college.management.audit;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import ke.college.management.audit.entity.AuditLog;
import ke.college.management.audit.repository.AuditLogRepository;
import ke.college.management.common.ApiResponse;
import ke.college.management.common.PageResponse;
import ke.college.management.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/audit-logs")
@RequiredArgsConstructor
@Tag(name = "Audit Logs", description = "Server-persisted immutable compliance audit logs")
public class AuditController {

    private final AuditLogRepository auditLogRepository;

    @GetMapping
    @PreAuthorize("hasAuthority('AUDIT_VIEW') or hasRole('ADMIN')")
    @Operation(summary = "Query audit logs with tenant isolation and server-side pagination")
    public ApiResponse<PageResponse<AuditLog>> getAuditLogs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String actorId,
            @RequestParam(required = false) String action,
            @RequestParam(required = false) String resourceType
    ) {
        String institutionId = SecurityUtils.getCurrentInstitutionId();
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));

        Page<AuditLog> auditLogsPage = auditLogRepository.filterAuditLogs(
                institutionId,
                actorId,
                action,
                resourceType,
                pageRequest
        );

        return ApiResponse.success(PageResponse.from(auditLogsPage));
    }
}
