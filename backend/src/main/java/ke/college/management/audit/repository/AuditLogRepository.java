package ke.college.management.audit.repository;

import ke.college.management.audit.entity.AuditLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, String> {

    Page<AuditLog> findByInstitutionIdOrderByCreatedAtDesc(String institutionId, Pageable pageable);

    @Query("SELECT a FROM AuditLog a WHERE a.institutionId = :institutionId AND " +
           "(:actorId IS NULL OR a.actorId = :actorId) AND " +
           "(:action IS NULL OR a.action = :action) AND " +
           "(:resourceType IS NULL OR a.resourceType = :resourceType) " +
           "ORDER BY a.createdAt DESC")
    Page<AuditLog> filterAuditLogs(
            @Param("institutionId") String institutionId,
            @Param("actorId") String actorId,
            @Param("action") String action,
            @Param("resourceType") String resourceType,
            Pageable pageable
    );
}
