package ke.college.management.academics.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LecturerClassDto {
    private String courseId;
    private String code;
    private String name;
    private String programId;
    private Integer creditHours;
    private Integer semester;
    private int enrolledCount;
}
