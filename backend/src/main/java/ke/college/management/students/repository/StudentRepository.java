package ke.college.management.students.repository;

import ke.college.management.students.entity.Student;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, String> {

    Optional<Student> findByInstitutionIdAndId(String institutionId, String id);

    Optional<Student> findByIdAndInstitutionId(String id, String institutionId);

    List<Student> findByInstitutionId(String institutionId);

    Optional<Student> findByInstitutionIdAndAdmissionNumber(String institutionId, String admissionNumber);

    Optional<Student> findByUserId(String userId);

    Optional<Student> findByInstitutionIdAndUserId(String institutionId, String userId);

    Page<Student> findByInstitutionId(String institutionId, Pageable pageable);

    @Query("SELECT s FROM Student s WHERE s.institutionId = :institutionId AND " +
           "(LOWER(s.fullName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(s.admissionNumber) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Student> searchStudents(
            @Param("institutionId") String institutionId,
            @Param("search") String search,
            Pageable pageable
    );
}
