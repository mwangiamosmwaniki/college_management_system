package ke.college.management.documents;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
public class PdfGeneratorService {

    /**
     * Generates an authoritative, standard-compliant PDF 1.4 admission letter
     * Returns raw binary bytes for real cryptographic hashing and S3 storage.
     */
    public byte[] generateAdmissionLetter(
            String institutionName,
            String studentName,
            String admissionNumber,
            String programTitle,
            String campusName,
            String academicTerm,
            String verificationCode
    ) {
        PdfDocumentBuilder pdf = new PdfDocumentBuilder();

        // Header and Institution title
        pdf.addText(50, 780, 20, true, institutionName.toUpperCase());
        pdf.addText(50, 758, 11, false, "OFFICE OF THE REGISTRAR (ACADEMIC AFFAIRS) - ADMISSIONS DIVISION");
        pdf.addLine(50, 748, 545, 748, 1.5f);

        // Date and Reference
        String currentDate = LocalDate.now().format(DateTimeFormatter.ofPattern("dd MMMM yyyy"));
        pdf.addText(50, 725, 10, false, "Date: " + currentDate);
        pdf.addText(380, 725, 10, true, "Ref: ADM/LTR/" + admissionNumber.replace("/", "-"));

        // Student details
        pdf.addText(50, 695, 11, true, "TO: " + studentName.toUpperCase());
        pdf.addText(50, 680, 10, false, "ADMISSION NUMBER: " + admissionNumber);
        pdf.addText(50, 665, 10, false, "CAMPUS: " + campusName);

        // Subject
        pdf.addText(50, 635, 13, true, "RE: FORMAL PROVISIONAL LETTER OF ADMISSION");
        pdf.addLine(50, 630, 420, 630, 1.0f);

        // Body paragraphs
        pdf.addText(50, 605, 10, false, "Dear " + studentName + ",");
        pdf.addText(50, 585, 10, false, "Following your application and successful academic review, we are pleased to offer you");
        pdf.addText(50, 570, 10, false, "provisional admission to pursue the following approved curriculum at our institution:");

        // Course highlight box
        pdf.addRectangle(50, 510, 495, 45, 0.8f);
        pdf.addText(65, 538, 12, true, "PROGRAM: " + programTitle.toUpperCase());
        pdf.addText(65, 520, 10, false, "COMMENCEMENT: " + academicTerm + " | CAMPUS OF STUDY: " + campusName);

        // Terms and conditions
        pdf.addText(50, 480, 10, true, "1. Acceptance of Offer & Fee Settlement:");
        pdf.addText(65, 465, 9, false, "- This offer is subject to satisfactory verification of your original certificates and identification.");
        pdf.addText(65, 450, 9, false, "- Initial institutional registration and tuition fees must be remitted via approved institutional channels.");

        pdf.addText(50, 425, 10, true, "2. Reporting and Orientation:");
        pdf.addText(65, 410, 9, false, "- Detailed reporting schedules and hostel allocation details are accessible via the Student Portal.");
        pdf.addText(65, 395, 9, false, "- You are required to complete online medical and institutional registration prior to commencement.");

        pdf.addText(50, 370, 10, true, "3. Academic Integrity & Institutional Regulations:");
        pdf.addText(65, 355, 9, false, "- Students are expected to strictly uphold academic honor codes and institutional statutes.");

        // Signatures block
        pdf.addText(50, 300, 10, true, "Yours Sincerely,");
        pdf.addText(50, 260, 11, true, "PROF. J. M. KARIUKI, PhD");
        pdf.addText(50, 245, 10, false, "Registrar (Academic & Student Affairs)");
        pdf.addText(50, 230, 9, false, institutionName);

        // Verification Footer Box
        pdf.addRectangle(50, 120, 495, 75, 0.5f);
        pdf.addText(60, 178, 10, true, "DOCUMENT SECURITY & AUTHENTICATION SEAL");
        pdf.addText(60, 163, 8, false, "Verification Code: " + verificationCode);
        pdf.addText(60, 150, 8, false, "Digital Fingerprint: SHA-256 cryptographically verified upon server issuance.");
        pdf.addText(60, 137, 8, false, "Verify online at: https://portal.institution.edu/verify?code=" + verificationCode);
        pdf.addText(60, 125, 8, false, "Notice: Any alteration or unauthorized reproduction voids this official institutional letter.");

        return pdf.build();
    }

    /**
     * Minimal, robust PDF 1.4 byte builder without external libraries
     */
    private static class PdfDocumentBuilder {
        private final List<String> objects = new ArrayList<>();
        private final StringBuilder contentStream = new StringBuilder();

        public void addText(float x, float y, float fontSize, boolean bold, String text) {
            String sanitized = escapePdfText(text);
            String fontTag = bold ? "/F1" : "/F2";
            contentStream.append(String.format("BT %s %.1f Tf %.2f %.2f Td (%s) Tj ET\n",
                    fontTag, fontSize, x, y, sanitized));
        }

        public void addLine(float x1, float y1, float x2, float y2, float lineWidth) {
            contentStream.append(String.format("%.2f w %.2f %.2f m %.2f %.2f l S\n", lineWidth, x1, y1, x2, y2));
        }

        public void addRectangle(float x, float y, float width, float height, float lineWidth) {
            contentStream.append(String.format("%.2f w %.2f %.2f %.2f %.2f re S\n", lineWidth, x, y, width, height));
        }

        private String escapePdfText(String text) {
            if (text == null) return "";
            return text.replace("\\", "\\\\")
                    .replace("(", "\\(")
                    .replace(")", "\\)");
        }

        public byte[] build() {
            try {
                ByteArrayOutputStream out = new ByteArrayOutputStream();
                out.write("%PDF-1.4\n%\xE2\xE3\xCF\xD3\n".getBytes(StandardCharsets.ISO_8859_1));

                List<Long> offsets = new ArrayList<>();

                // Object 1: Catalog
                offsets.add((long) out.size());
                out.write("1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n".getBytes(StandardCharsets.US_ASCII));

                // Object 2: Pages
                offsets.add((long) out.size());
                out.write("2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n".getBytes(StandardCharsets.US_ASCII));

                // Object 3: Page (A4: 595 x 842 points)
                offsets.add((long) out.size());
                String pageObj = "3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R " +
                        "/Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> >>\nendobj\n";
                out.write(pageObj.getBytes(StandardCharsets.US_ASCII));

                // Object 4: Contents Stream
                byte[] streamBytes = contentStream.toString().getBytes(StandardCharsets.ISO_8859_1);
                offsets.add((long) out.size());
                String contentObjHeader = String.format("4 0 obj\n<< /Length %d >>\nstream\n", streamBytes.length);
                out.write(contentObjHeader.getBytes(StandardCharsets.US_ASCII));
                out.write(streamBytes);
                out.write("\nendstream\nendobj\n".getBytes(StandardCharsets.US_ASCII));

                // Object 5: Font F1 (Helvetica-Bold)
                offsets.add((long) out.size());
                out.write("5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj\n".getBytes(StandardCharsets.US_ASCII));

                // Object 6: Font F2 (Helvetica)
                offsets.add((long) out.size());
                out.write("6 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n".getBytes(StandardCharsets.US_ASCII));

                // Cross-reference table
                long startXref = out.size();
                int totalObjects = offsets.size() + 1;
                out.write(String.format("xref\n0 %d\n0000000000 65535 f \n", totalObjects).getBytes(StandardCharsets.US_ASCII));
                for (Long offset : offsets) {
                    out.write(String.format("%010d 00000 n \n", offset).getBytes(StandardCharsets.US_ASCII));
                }

                // Trailer
                String trailer = String.format("trailer\n<< /Size %d /Root 1 0 R >>\nstartxref\n%d\n%%%%EOF\n", totalObjects, startXref);
                out.write(trailer.getBytes(StandardCharsets.US_ASCII));

                return out.toByteArray();
            } catch (IOException e) {
                throw new RuntimeException("Failed to generate standard PDF document", e);
            }
        }
    }
}
