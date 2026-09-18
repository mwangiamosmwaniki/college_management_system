package ke.college.management.users.repository;

import ke.college.management.users.entity.UserPortalAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserPortalAssignmentRepository extends JpaRepository<UserPortalAssignment, String> {

    List<UserPortalAssignment> findByUserIdAndActiveTrue(String userId);

    List<UserPortalAssignment> findByUserId(String userId);

    Optional<UserPortalAssignment> findByUserIdAndPortalId(String userId, String portalId);

    Optional<UserPortalAssignment> findByUserIdAndPortalIdAndActiveTrue(String userId, String portalId);
}
