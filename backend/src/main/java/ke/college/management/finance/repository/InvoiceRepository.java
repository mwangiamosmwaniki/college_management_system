package ke.college.management.finance.repository;

import ke.college.management.finance.entity.Invoice;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, String> {
    List<Invoice> findByStudentId(String studentId);
    Page<Invoice> findByInstitutionId(String institutionId, Pageable pageable);
    Optional<Invoice> findByInstitutionIdAndInvoiceNumber(String institutionId, String invoiceNumber);
}
