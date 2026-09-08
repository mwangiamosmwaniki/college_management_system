package ke.college.management.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {
    private String id;
    private String identifier;
    private String email;
    private String fullName;
    private String institutionId;
    private String departmentId;
    private String campusId;
    private String status;
    private List<String> roles;
    private List<String> permissions;
}
