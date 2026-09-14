package ke.college.management.academics;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import ke.college.management.academics.dto.LecturerClassDto;
import ke.college.management.academics.dto.LecturerStudentDto;
import ke.college.management.academics.entity.Course;
import ke.college.management.academics.entity.CourseEnrollment;
import ke.college.management.academics.repository.CourseEnrollmentRepository;
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
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/lecturers")
@RequiredArgsConstructor
@Tag(name = "Lecturers", description = "Lecturer portal server-enforced scoped data endpoints")
public class LecturerController {

    private final CourseRepository courseRepository;
    private final StudentRepository studentRepository;
    private final CourseEnrollmentRepository courseEnrollmentRepository;

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
    public ApiResponse<List<LecturerClassDto>> getMyClasses() {
        String userId = SecurityUtils.getCurrentUserId();
        List<Course> courses = courseRepository.findByLecturerUserId(userId);

        List<LecturerClassDto> classes = new ArrayList<>();
        for (Course course : courses) {
            int enrolledCount = courseEnrollmentRepository
                    .findByCourseIdAndStatus(course.getId(), "ENROLLED")
                    .size();

            classes.add(LecturerClassDto.builder()
                    .courseId(course.getId())
                    .code(course.getCode())
                    .name(course.getName())
                    .programId(course.getProgramId())
                    .creditHours(course.getCreditHours())
                    .semester(course.getSemester())
                    .enrolledCount(enrolledCount)
                    .build());
        }

        return ApiResponse.success(classes);
    }

    @GetMapping("/me/students")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get students under supervision of currently authenticated lecturer")
    public ApiResponse<List<LecturerStudentDto>> getMyStudents() {
        String userId = SecurityUtils.getCurrentUserId();
        String institutionId = SecurityUtils.getCurrentInstitutionId();
        List<Course> courses = courseRepository.findByLecturerUserId(userId);

        if (courses.isEmpty()) {
            return ApiResponse.success(List.of());
        }

        List<String> courseIds = courses.stream().map(Course::getId).toList();
        List<CourseEnrollment> enrollments = courseEnrollmentRepository.findByCourseIdInAndStatus(courseIds, "ENROLLED");
        if (enrollments.isEmpty()) {
            return ApiResponse.success(List.of());
        }

        Map<String, Course> courseMap = courses.stream().collect(Collectors.toMap(Course::getId, c -> c));
        List<String> studentIds = enrollments.stream().map(CourseEnrollment::getStudentId).distinct().toList();

        Map<String, Student> studentMap = studentRepository.findAllById(studentIds).stream()
                .filter(s -> institutionId.equals(s.getInstitutionId()))
                .collect(Collectors.toMap(Student::getId, s -> s));

        List<LecturerStudentDto> result = new ArrayList<>();
        for (CourseEnrollment enrollment : enrollments) {
            Student student = studentMap.get(enrollment.getStudentId());
            Course course = courseMap.get(enrollment.getCourseId());
            if (student != null && course != null) {
                result.add(LecturerStudentDto.builder()
                        .id(student.getId())
                        .admissionNumber(student.getAdmissionNumber())
                        .fullName(student.getFullName())
                        .gender(student.getGender())
                        .programId(student.getProgramId())
                        .courseId(course.getId())
                        .courseCode(course.getCode())
                        .courseName(course.getName())
                        .enrollmentStatus(enrollment.getStatus())
                        .build());
            }
        }

        return ApiResponse.success(result);
    }

    @GetMapping("/me/workload")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get teaching workload summary for currently authenticated lecturer")
    public ApiResponse<Map<String, Object>> getMyWorkload() {
        String userId = SecurityUtils.getCurrentUserId();
        List<Course> courses = courseRepository.findByLecturerUserId(userId);

        int totalCreditHours = courses.stream().mapToInt(c -> c.getCreditHours() != null ? c.getCreditHours() : 3).sum();
        List<String> courseIds = courses.stream().map(Course::getId).toList();

        long totalUniqueStudents = courseIds.isEmpty() ? 0 :
                courseEnrollmentRepository.findByCourseIdInAndStatus(courseIds, "ENROLLED").stream()
                        .map(CourseEnrollment::getStudentId)
                        .distinct()
                        .count();

        Map<String, Object> workload = new HashMap<>();
        workload.put("totalCourses", courses.size());
        workload.put("totalCreditHours", totalCreditHours);
        workload.put("totalStudents", (int) totalUniqueStudents);
        workload.put("assignedClasses", courses.size());

        return ApiResponse.success(workload);
    }
}
