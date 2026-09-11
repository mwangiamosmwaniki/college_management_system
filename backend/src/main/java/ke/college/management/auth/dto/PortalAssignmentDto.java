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
    private String portalId;
    private String roleId;
    private String roleName;
    private boolean isAdmin;
    private boolean isMonitor;
    private String assignedAt;
}
