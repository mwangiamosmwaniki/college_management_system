package ke.college.management.academics.repository;

import ke.college.management.academics.entity.StudentMark;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentMarkRepository extends JpaRepository<StudentMark, String> {
    List<StudentMark> findByAssessmentId(String assessmentId);
    List<StudentMark> findByStudentId(String studentId);
    Optional<StudentMark> findByAssessmentIdAndStudentId(String assessmentId, String studentId);
}
