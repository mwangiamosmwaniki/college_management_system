package ke.college.management.admissions.repository;

import ke.college.management.admissions.entity.Application;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, String> {
    Page<Application> findByInstitutionId(String institutionId, Pageable pageable);
    Optional<Application> findByInstitutionIdAndReferenceNumber(String institutionId, String referenceNumber);
}
