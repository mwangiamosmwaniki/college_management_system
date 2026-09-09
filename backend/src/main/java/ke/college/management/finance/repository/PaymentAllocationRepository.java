package ke.college.management.finance.repository;

import ke.college.management.finance.entity.PaymentAllocation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentAllocationRepository extends JpaRepository<PaymentAllocation, String> {

    List<PaymentAllocation> findByPaymentId(String paymentId);

    List<PaymentAllocation> findByInvoiceId(String invoiceId);
}
