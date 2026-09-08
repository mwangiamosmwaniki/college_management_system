package ke.college.management.academics.repository;

import ke.college.management.academics.entity.Assessment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AssessmentRepository extends JpaRepository<Assessment, String> {
    List<Assessment> findByCourseId(String courseId);
}
