package ke.college.management.academics.repository;

import ke.college.management.academics.entity.AcademicTerm;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AcademicTermRepository extends JpaRepository<AcademicTerm, String> {
    List<AcademicTerm> findByInstitutionId(String institutionId);
    Optional<AcademicTerm> findFirstByInstitutionIdAndIsActiveTrue(String institutionId);
    Optional<AcademicTerm> findFirstByInstitutionIdOrderByStartDateDesc(String institutionId);
}
