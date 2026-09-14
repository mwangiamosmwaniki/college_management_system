package ke.college.management.academics.repository;

import ke.college.management.academics.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseRepository extends JpaRepository<Course, String> {
    List<Course> findByLecturerUserId(String lecturerUserId);
    List<Course> findByProgramId(String programId);
}
