package ke.college.management.audit;

import ke.college.management.audit.entity.AuditLog;
import ke.college.management.audit.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuditService {

    private static final Logger log = LoggerFactory.getLogger(AuditService.class);
    private final AuditLogRepository auditLogRepository;

    @Async
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void recordEvent(
            String institutionId,
            String actorId,
            String actorIdentifier,
            String action,
            String resourceType,
            String resourceId,
            String status,
            String ipAddress,
            String userAgent,
            String requestId,
            String details,
            String previousState,
            String newState
    ) {
        try {
            AuditLog auditLog = AuditLog.builder()
                    .id("aud_" + UUID.randomUUID().toString().replace("-", "").substring(0, 16))
                    .institutionId(institutionId)
                    .actorId(actorId)
                    .actorIdentifier(actorIdentifier)
                    .action(action)
                    .resourceType(resourceType)
                    .resourceId(resourceId)
                    .status(status != null ? status : "SUCCESS")
                    .ipAddress(ipAddress)
                    .userAgent(userAgent)
                    .requestId(requestId != null ? requestId : UUID.randomUUID().toString())
                    .details(details)
                    .previousState(previousState)
                    .newState(newState)
                    .createdAt(Instant.now())
                    .build();

            auditLogRepository.save(auditLog);
            log.info("Audit log recorded: {} on {} by {} in institution {}", action, resourceType, actorId, institutionId);
        } catch (Exception ex) {
            log.error("Failed to persist audit log entry: {}", ex.getMessage());
        }
    }
}
