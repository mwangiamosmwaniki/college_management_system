package ke.college.management.finance.repository;

import ke.college.management.finance.entity.FinancialLedger;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FinancialLedgerRepository extends JpaRepository<FinancialLedger, String> {

    List<FinancialLedger> findByStudentIdOrderByCreatedAtAsc(String studentId);

    Page<FinancialLedger> findByInstitutionId(String institutionId, Pageable pageable);

    Page<FinancialLedger> findByStudentId(String studentId, Pageable pageable);
}
