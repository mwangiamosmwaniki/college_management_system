package ke.college.management.notifications;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import ke.college.management.common.ApiResponse;
import ke.college.management.exceptions.ResourceNotFoundException;
import ke.college.management.exceptions.UnauthorizedException;
import ke.college.management.notifications.entity.Notification;
import ke.college.management.notifications.repository.NotificationRepository;
import ke.college.management.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/notifications")
@RequiredArgsConstructor
@Tag(name = "Notifications", description = "Server-scoped notifications for authenticated users")
public class NotificationController {

    private final NotificationRepository notificationRepository;

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get notifications scoped strictly to the currently authenticated user")
    public ApiResponse<List<Notification>> getMyNotifications() {
        String userId = SecurityUtils.getCurrentUserId();
        String institutionId = SecurityUtils.getCurrentInstitutionId();
        return ApiResponse.success(notificationRepository.findByInstitutionIdAndUserIdOrderByCreatedAtDesc(institutionId, userId));
    }

    @PutMapping("/{id}/read")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Mark notification as read with strict ownership validation")
    public ApiResponse<Notification> markAsRead(@PathVariable String id) {
        String userId = SecurityUtils.getCurrentUserId();
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));

        if (!notification.getUserId().equals(userId)) {
            throw new UnauthorizedException("Access denied: cannot modify another user's notification");
        }

        notification.setIsRead(true);
        return ApiResponse.success("Marked as read", notificationRepository.save(notification));
    }
}
