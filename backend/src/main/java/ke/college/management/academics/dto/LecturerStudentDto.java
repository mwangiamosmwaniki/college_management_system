package ke.college.management.academics.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LecturerStudentDto {
    private String id;
    private String admissionNumber;
    private String fullName;
    private String gender;
    private String programId;
    private String courseId;
    private String courseCode;
    private String courseName;
    private String enrollmentStatus;
}
