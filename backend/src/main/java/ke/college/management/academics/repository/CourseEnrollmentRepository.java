package ke.college.management.academics.repository;

import ke.college.management.academics.entity.CourseEnrollment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CourseEnrollmentRepository extends JpaRepository<CourseEnrollment, String> {

    List<CourseEnrollment> findByStudentId(String studentId);

    List<CourseEnrollment> findByStudentIdAndStatus(String studentId, String status);

    List<CourseEnrollment> findByStudentIdAndAcademicTermIdAndStatus(String studentId, String academicTermId, String status);

    List<CourseEnrollment> findByCourseId(String courseId);

    List<CourseEnrollment> findByCourseIdAndStatus(String courseId, String status);

    List<CourseEnrollment> findByCourseIdIn(List<String> courseIds);

    List<CourseEnrollment> findByCourseIdInAndStatus(List<String> courseIds, String status);

    Optional<CourseEnrollment> findByStudentIdAndCourseId(String studentId, String courseId);

    Optional<CourseEnrollment> findByStudentIdAndCourseIdAndAcademicTermId(String studentId, String courseId, String academicTermId);

    boolean existsByStudentIdAndCourseIdAndAcademicTermId(String studentId, String courseId, String academicTermId);

    void deleteByStudentIdAndCourseId(String studentId, String courseId);
}
