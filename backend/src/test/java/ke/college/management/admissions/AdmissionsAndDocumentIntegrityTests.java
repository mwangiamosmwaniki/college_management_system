package ke.college.management.admissions;

import ke.college.management.admissions.entity.Application;
import ke.college.management.admissions.repository.ApplicationRepository;
import ke.college.management.auth.AuthService;
import ke.college.management.documents.DocumentStorageService;
import ke.college.management.documents.PdfGeneratorService;
import ke.college.management.documents.entity.DocumentRecord;
import ke.college.management.documents.repository.DocumentRepository;
import ke.college.management.exceptions.BadRequestException;
import ke.college.management.institutions.entity.Campus;
import ke.college.management.institutions.entity.Institution;
import ke.college.management.institutions.repository.CampusRepository;
import ke.college.management.institutions.repository.InstitutionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.security.MessageDigest;
import java.time.Instant;
import java.time.LocalDate;
import java.util.HexFormat;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
@ActiveProfiles("test")
class AdmissionsAndDocumentIntegrityTests {

    @Autowired
    private AdmissionsController admissionsController;

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private AdmissionSequenceService admissionSequenceService;

    @Autowired
    private PdfGeneratorService pdfGeneratorService;

    @Autowired
    private DocumentStorageService documentStorageService;

    @Autowired
    private DocumentRepository documentRepository;

    @Autowired
    private AuthService authService;

    @Autowired
    private InstitutionRepository institutionRepository;

    @Autowired
    private CampusRepository campusRepository;

    private String institutionId;
    private String campusId;

    @BeforeEach
    void setUp() {
        institutionId = "inst_test_" + UUID.randomUUID().toString().substring(0, 8);
        campusId = "camp_test_" + UUID.randomUUID().toString().substring(0, 8);

        Institution institution = Institution.builder()
                .id(institutionId)
                .name("Apex Institute of Technology")
                .code("APEX")
                .status("ACTIVE")
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();
        institutionRepository.save(institution);

        Campus campus = Campus.builder()
                .id(campusId)
                .institutionId(institutionId)
                .name("Main Campus")
                .code("MAIN")
                .isActive(true)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();
        campusRepository.save(campus);
    }

    @Test
    @Transactional
    @DisplayName("P0: Admission State Machine - SUBMITTED applications cannot directly matriculate into students")
    void submittedApplication_CannotMatriculate() {
        Application app = Application.builder()
                .id("app_sub_01")
                .institutionId(institutionId)
                .fullName("Jane Doe")
                .email("jane.doe@example.com")
                .referenceNumber("APP-2026-1001")
                .status("SUBMITTED")
                .programId("PROG-CS")
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();
        applicationRepository.save(app);

        // Attempting to matriculate directly from SUBMITTED must throw BadRequestException
        assertThrows(BadRequestException.class, () -> {
            admissionsController.matriculate(app.getId(), campusId, "Term 1 2026");
        });
    }

    @Test
    @Transactional
    @DisplayName("P0: Admission State Machine - REJECTED applications cannot accept offer")
    void rejectedApplication_CannotAcceptOffer() {
        Application app = Application.builder()
                .id("app_rej_01")
                .institutionId(institutionId)
                .fullName("Rejected Applicant")
                .email("rejected@example.com")
                .referenceNumber("APP-2026-1002")
                .status("REJECTED")
                .programId("PROG-CS")
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();
        applicationRepository.save(app);

        assertThrows(BadRequestException.class, () -> {
            admissionsController.acceptOffer(app.getId());
        });
    }

    @Test
    @Transactional
    @DisplayName("P0: Admission Number Generation - Sequence matches ADM/{YEAR}/{000001} and increments monotonically")
    void admissionSequenceService_GeneratesMonotonicZeroPaddedNumbers() {
        int year = LocalDate.now().getYear();

        String num1 = admissionSequenceService.generateNextAdmissionNumber(institutionId, year);
        String num2 = admissionSequenceService.generateNextAdmissionNumber(institutionId, year);

        assertNotNull(num1);
        assertNotNull(num2);
        assertTrue(num1.startsWith("ADM/" + year + "/"));
        assertTrue(num2.startsWith("ADM/" + year + "/"));
        assertEquals("ADM/" + year + "/000001", num1);
        assertEquals("ADM/" + year + "/000002", num2);
    }

    @Test
    @Transactional
    @DisplayName("P0: Real Document Generation - PDF header is valid and stored hash matches SHA-256(actual PDF bytes)")
    void realDocumentGeneration_ValidPdfAndAccurateSha256() throws Exception {
        byte[] pdfBytes = pdfGeneratorService.generateAdmissionLetter(
                "Apex Institute of Technology",
                "Alice Wanjiku",
                "ADM/2026/000001",
                "Diploma in Information Technology",
                "Main Campus",
                "Term 1 2026",
                "VER-ADM-TEST1234"
        );

        assertNotNull(pdfBytes);
        assertTrue(pdfBytes.length > 100);

        // Verify PDF Magic Bytes (%PDF-1.4)
        String pdfHeader = new String(pdfBytes, 0, 8);
        assertTrue(pdfHeader.startsWith("%PDF-1.4"));

        // Store generated document
        DocumentRecord doc = documentStorageService.storeGeneratedDocument(
                pdfBytes,
                "ADMISSION_LETTER",
                "stu_alice_01",
                "Letter of Admission - ADM/2026/000001",
                "application/pdf",
                institutionId,
                "usr_admissions_officer"
        );

        assertNotNull(doc);
        assertNotNull(doc.getFileHash());

        // Verify SHA-256 calculation against real bytes
        MessageDigest digest = MessageDigest.getInstance("SHA-256");
        byte[] expectedHashBytes = digest.digest(pdfBytes);
        String expectedHash = HexFormat.of().formatHex(expectedHashBytes);

        assertEquals(expectedHash, doc.getFileHash(), "Stored document hash must match SHA-256 of actual PDF bytes");
    }
}
