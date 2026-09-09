package ke.college.management.lms.repository;

import ke.college.management.lms.entity.LmsSubmission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LmsSubmissionRepository extends JpaRepository<LmsSubmission, String> {

    List<LmsSubmission> findByAssignmentId(String assignmentId);

    List<LmsSubmission> findByStudentId(String studentId);

    Optional<LmsSubmission> findByAssignmentIdAndStudentId(String assignmentId, String studentId);
}
