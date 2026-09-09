package ke.college.management.hr.repository;

import ke.college.management.hr.entity.PayrollBatch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PayrollBatchRepository extends JpaRepository<PayrollBatch, String> {

    List<PayrollBatch> findByInstitutionId(String institutionId);

    Optional<PayrollBatch> findByInstitutionIdAndMonthYear(String institutionId, String monthYear);
}
