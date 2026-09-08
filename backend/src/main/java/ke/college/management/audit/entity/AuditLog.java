package ke.college.management.audit.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Entity
@Table(name = "audit_logs")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuditLog {

    @Id
    @Column(length = 64)
    private String id;

    @Column(name = "institution_id", nullable = false, length = 64)
    private String institutionId;

    @Column(name = "actor_id", nullable = false, length = 64)
    private String actorId;

    @Column(name = "actor_identifier", length = 128)
    private String actorIdentifier;

    @Column(nullable = false, length = 128)
    private String action;

    @Column(name = "resource_type", nullable = false, length = 128)
    private String resourceType;

    @Column(name = "resource_id", length = 128)
    private String resourceId;

    @Column(nullable = false, length = 32)
    @Builder.Default
    private String status = "SUCCESS";

    @Column(name = "ip_address", length = 64)
    private String ipAddress;

    @Column(name = "user_agent", length = 512)
    private String userAgent;

    @Column(name = "request_id", length = 128)
    private String requestId;

    @Column(columnDefinition = "TEXT")
    private String details;

    @Column(name = "previous_state", columnDefinition = "jsonb")
    private String previousState;

    @Column(name = "new_state", columnDefinition = "jsonb")
    private String newState;

    @Column(name = "created_at", updatable = false)
    @Builder.Default
    private Instant createdAt = Instant.now();
}
