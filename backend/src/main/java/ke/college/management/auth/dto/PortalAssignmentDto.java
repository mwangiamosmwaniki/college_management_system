package ke.college.management.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PortalAssignmentDto {
    private String id;
    private String portalId;
    private String roleId;
    private String roleName;
    private boolean isDefault;
    private String institutionId;
    private boolean active;
    private boolean isAdmin;
    private boolean isMonitor;
    private String assignedAt;
    private String revokedAt;
}
