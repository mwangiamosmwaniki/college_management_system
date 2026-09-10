package ke.college.management.admissions.repository;

import jakarta.persistence.LockModeType;
import ke.college.management.admissions.entity.AdmissionSequence;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AdmissionSequenceRepository extends JpaRepository<AdmissionSequence, AdmissionSequence.AdmissionSequenceId> {

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT s FROM AdmissionSequence s WHERE s.institutionId = :institutionId AND s.academicYear = :year")
    Optional<AdmissionSequence> findForUpdate(
            @Param("institutionId") String institutionId,
            @Param("year") Integer year
    );
}
