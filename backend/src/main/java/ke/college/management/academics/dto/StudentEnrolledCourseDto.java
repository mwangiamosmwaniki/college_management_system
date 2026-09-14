package ke.college.management.academics.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentEnrolledCourseDto {
    private String id;
    private String enrollmentId;
    private String courseId;
    private String code;
    private String name;
    private Integer creditHours;
    private Integer semester;
    private String academicTermId;
    private String status;
    private LocalDate enrollmentDate;
}
