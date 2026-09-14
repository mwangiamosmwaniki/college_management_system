package ke.college.management.notifications.repository;

import ke.college.management.notifications.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, String> {
    List<Notification> findByInstitutionIdAndUserIdOrderByCreatedAtDesc(String institutionId, String userId);
    List<Notification> findByUserIdOrderByCreatedAtDesc(String userId);
}
