package ke.college.management.finance.repository;

import ke.college.management.finance.entity.Receipt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReceiptRepository extends JpaRepository<Receipt, String> {

    Optional<Receipt> findByReceiptNumber(String receiptNumber);

    Optional<Receipt> findByPaymentId(String paymentId);

    List<Receipt> findByStudentId(String studentId);

    List<Receipt> findByInstitutionId(String institutionId);
}
