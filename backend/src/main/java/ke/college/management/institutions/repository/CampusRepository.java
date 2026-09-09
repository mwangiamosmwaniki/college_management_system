package ke.college.management.institutions.repository;

import ke.college.management.institutions.entity.Campus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CampusRepository extends JpaRepository<Campus, String> {
    List<Campus> findByInstitutionId(String institutionId);
    Optional<Campus> findByInstitutionIdAndCode(String institutionId, String code);
    Optional<Campus> findFirstByInstitutionIdOrderByCreatedAtAsc(String institutionId);
}
