package ke.college.management.finance.repository;

import ke.college.management.finance.entity.MpesaTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Repository
public interface MpesaTransactionRepository extends JpaRepository<MpesaTransaction, String> {
    Optional<MpesaTransaction> findByCheckoutRequestId(String checkoutRequestId);
    boolean existsByCheckoutRequestId(String checkoutRequestId);
    List<MpesaTransaction> findByInstitutionId(String institutionId);
    List<MpesaTransaction> findByStatusAndCreatedAtBefore(String status, Instant createdAt);
}
