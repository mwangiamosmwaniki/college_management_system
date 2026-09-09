package ke.college.management.finance;

import ke.college.management.finance.dto.CreateInvoiceRequest;
import ke.college.management.finance.dto.RecordPaymentRequest;
import ke.college.management.finance.entity.FinancialLedger;
import ke.college.management.finance.entity.Invoice;
import ke.college.management.finance.entity.Payment;
import ke.college.management.finance.entity.Receipt;
import ke.college.management.finance.repository.FinancialLedgerRepository;
import ke.college.management.finance.repository.InvoiceRepository;
import ke.college.management.finance.repository.ReceiptRepository;
import ke.college.management.security.CustomUserDetails;
import ke.college.management.students.entity.Student;
import ke.college.management.students.repository.StudentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
@ActiveProfiles("test")
class FinanceLedgerAndAllocationTests {

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private InvoiceRepository invoiceRepository;

    @Autowired
    private ReceiptRepository receiptRepository;

    @Autowired
    private FinancialLedgerRepository financialLedgerRepository;

    private Student testStudent;

    @BeforeEach
    void setUp() {
        CustomUserDetails userDetails = new CustomUserDetails(
                "usr_finance_admin",
                "admin@apex.edu",
                "FIN-001",
                "hashed",
                "inst_apex_tvet",
                "Finance Officer",
                List.of(new SimpleGrantedAuthority("ROLE_ADMIN"), new SimpleGrantedAuthority("FINANCE_MANAGE")),
                true
        );
        SecurityContext context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities()));
        SecurityContextHolder.setContext(context);

        testStudent = Student.builder()
                .id("stu_fin_test_" + System.currentTimeMillis())
                .institutionId("inst_apex_tvet")
                .admissionNumber("ADM/2026/FIN01")
                .fullName("Financial Test Student")
                .email("student.fin@apex.edu")
                .feeBalance(BigDecimal.ZERO)
                .status("ACTIVE")
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();
        studentRepository.save(testStudent);
    }

    @Test
    @Transactional
    @DisplayName("P0: Creating invoice must debit ledger and update student balance atomically")
    void createInvoice_UpdatesLedgerAndBalance() {
        CreateInvoiceRequest req = CreateInvoiceRequest.builder()
                .studentId(testStudent.getId())
                .academicTermId("term_2026_1")
                .title("Term 1 2026 Tuition Fee")
                .amount(new BigDecimal("45000.00"))
                .dueDate(LocalDate.now().plusDays(30))
                .build();

        Invoice invoice = paymentService.createInvoice(req);
        assertNotNull(invoice.getId());
        assertEquals("UNPAID", invoice.getStatus());

        // Verify student fee balance updated
        Student updated = studentRepository.findById(testStudent.getId()).orElseThrow();
        assertEquals(0, new BigDecimal("45000.00").compareTo(updated.getFeeBalance()));

        // Verify financial ledger debit
        List<FinancialLedger> ledger = financialLedgerRepository.findByStudentIdOrderByCreatedAtAsc(testStudent.getId());
        assertTrue(!ledger.isEmpty());
        assertEquals("INVOICE_CHARGE", ledger.get(0).getEntryType());
    }

    @Test
    @Transactional
    @DisplayName("P0: Recording payment must create receipt, allocation, and credit ledger")
    void recordPayment_CreatesReceiptAndAllocates() {
        // Create initial invoice
        CreateInvoiceRequest invReq = CreateInvoiceRequest.builder()
                .studentId(testStudent.getId())
                .academicTermId("term_2026_1")
                .title("Term 1 2026 Tuition Fee")
                .amount(new BigDecimal("20000.00"))
                .dueDate(LocalDate.now().plusDays(30))
                .build();
        Invoice invoice = paymentService.createInvoice(invReq);

        // Record manual payment
        RecordPaymentRequest payReq = RecordPaymentRequest.builder()
                .studentId(testStudent.getId())
                .invoiceId(invoice.getId())
                .amount(new BigDecimal("20000.00"))
                .paymentMethod("BANK_TRANSFER")
                .transactionReference("TX-EQUITY-998811")
                .payerName("Parent Jane Doe")
                .build();

        Payment payment = paymentService.recordManualPayment(payReq);
        assertNotNull(payment.getId());
        assertEquals("SUCCESS", payment.getStatus());

        // Verify receipt created
        List<Receipt> receipts = receiptRepository.findByStudentId(testStudent.getId());
        assertTrue(!receipts.isEmpty());

        // Verify invoice marked PAID
        Invoice updatedInv = invoiceRepository.findById(invoice.getId()).orElseThrow();
        assertEquals("PAID", updatedInv.getStatus());
        assertEquals(0, BigDecimal.ZERO.compareTo(updatedInv.getBalance()));

        // Verify student balance cleared
        Student updatedStudent = studentRepository.findById(testStudent.getId()).orElseThrow();
        assertEquals(0, BigDecimal.ZERO.compareTo(updatedStudent.getFeeBalance()));
    }
}
