package ke.college.management.academics;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import ke.college.management.academics.entity.Course;
import ke.college.management.academics.repository.CourseRepository;
import ke.college.management.common.ApiResponse;
import ke.college.management.security.SecurityUtils;
import ke.college.management.students.entity.Student;
import ke.college.management.students.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/lecturers")
@RequiredArgsConstructor
@Tag(name = "Lecturers", description = "Lecturer portal server-enforced scoped data endpoints")
public class LecturerController {

    private final CourseRepository courseRepository;
    private final StudentRepository studentRepository;

    @GetMapping("/me/courses")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get courses assigned to currently authenticated lecturer")
    public ApiResponse<List<Course>> getMyCourses() {
        String userId = SecurityUtils.getCurrentUserId();
        return ApiResponse.success(courseRepository.findByLecturerUserId(userId));
    }

    @GetMapping("/me/classes")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get classes assigned to currently authenticated lecturer")
    public ApiResponse<List<Map<String, Object>>> getMyClasses() {
        String userId = SecurityUtils.getCurrentUserId();
        String institutionId = SecurityUtils.getCurrentInstitutionId();
        List<Course> courses = courseRepository.findByLecturerUserId(userId);

        List<Map<String, Object>> classes = new ArrayList<>();
        for (Course course : courses) {
            Map<String, Object> classInfo = new HashMap<>();
            classInfo.put("courseId", course.getId());
            classInfo.put("code", course.getCode());
            classInfo.put("name", course.getName());
            classInfo.put("programId", course.getProgramId());
            classInfo.put("creditHours", course.getCreditHours());
            classInfo.put("semester", course.getSemester());

            // Count enrolled students in this program
            List<Student> students = studentRepository.findByInstitutionIdAndProgramIdIn(
                    institutionId, List.of(course.getProgramId())
            );
            classInfo.put("enrolledCount", students.size());
            classes.add(classInfo);
        }

        return ApiResponse.success(classes);
    }

    @GetMapping("/me/students")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get students under supervision of currently authenticated lecturer")
    public ApiResponse<List<Student>> getMyStudents() {
        String userId = SecurityUtils.getCurrentUserId();
        String institutionId = SecurityUtils.getCurrentInstitutionId();
        List<Course> courses = courseRepository.findByLecturerUserId(userId);

        if (courses.isEmpty()) {
            return ApiResponse.success(List.of());
        }

        List<String> programIds = courses.stream()
                .map(Course::getProgramId)
                .distinct()
                .toList();

        List<Student> students = studentRepository.findByInstitutionIdAndProgramIdIn(institutionId, programIds);
        return ApiResponse.success(students);
    }

    @GetMapping("/me/workload")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get teaching workload summary for currently authenticated lecturer")
    public ApiResponse<Map<String, Object>> getMyWorkload() {
        String userId = SecurityUtils.getCurrentUserId();
        String institutionId = SecurityUtils.getCurrentInstitutionId();
        List<Course> courses = courseRepository.findByLecturerUserId(userId);

        int totalCreditHours = courses.stream().mapToInt(c -> c.getCreditHours() != null ? c.getCreditHours() : 3).sum();
        List<String> programIds = courses.stream().map(Course::getProgramId).distinct().toList();
        int totalStudents = programIds.isEmpty() ? 0 : studentRepository.findByInstitutionIdAndProgramIdIn(institutionId, programIds).size();

        Map<String, Object> workload = new HashMap<>();
        workload.put("totalCourses", courses.size());
        workload.put("totalCreditHours", totalCreditHours);
        workload.put("totalStudents", totalStudents);
        workload.put("assignedClasses", courses.size());

        return ApiResponse.success(workload);
    }
}
