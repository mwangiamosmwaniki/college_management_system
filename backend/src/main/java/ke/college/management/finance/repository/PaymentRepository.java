package ke.college.management.finance.repository;

import ke.college.management.finance.entity.Payment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, String> {
    List<Payment> findByStudentId(String studentId);
    Page<Payment> findByInstitutionId(String institutionId, Pageable pageable);
    Optional<Payment> findByInstitutionIdAndTransactionReference(String institutionId, String transactionReference);
    boolean existsByInstitutionIdAndTransactionReference(String institutionId, String transactionReference);
}
