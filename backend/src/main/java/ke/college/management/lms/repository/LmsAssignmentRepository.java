package ke.college.management.lms.repository;

import ke.college.management.lms.entity.LmsAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LmsAssignmentRepository extends JpaRepository<LmsAssignment, String> {

    List<LmsAssignment> findByCourseId(String courseId);
}
