package ke.college.management.testfixtures;

import ke.college.management.academics.entity.Course;
import ke.college.management.academics.entity.CourseEnrollment;
import ke.college.management.academics.repository.CourseEnrollmentRepository;
import ke.college.management.academics.repository.CourseRepository;
import ke.college.management.finance.entity.Invoice;
import ke.college.management.finance.repository.InvoiceRepository;
import ke.college.management.academics.entity.AcademicTerm;
import ke.college.management.academics.repository.AcademicTermRepository;
import ke.college.management.institutions.entity.Institution;
import ke.college.management.institutions.repository.InstitutionRepository;
import ke.college.management.security.CustomUserDetails;
import ke.college.management.students.entity.Student;
import ke.college.management.students.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Profile;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

@Component
@Profile("test")
@RequiredArgsConstructor
public class TestEnvironmentFixture {

    private final InstitutionRepository institutionRepository;
    private final StudentRepository studentRepository;
    private final CourseRepository courseRepository;
    private final CourseEnrollmentRepository courseEnrollmentRepository;
    private final InvoiceRepository invoiceRepository;
    private final AcademicTermRepository academicTermRepository;

    public static final String TENANT_PRIMARY = "inst_apex_tvet";
    public static final String TENANT_FOREIGN = "inst_foreign_poly";

    public void authenticateAs(String userId, String email, String institutionId, String role, List<String> permissions) {
        List<SimpleGrantedAuthority> authorities = new java.util.ArrayList<>();
        authorities.add(new SimpleGrantedAuthority("ROLE_" + role.toUpperCase()));
        if (permissions != null) {
            for (String perm : permissions) {
                authorities.add(new SimpleGrantedAuthority(perm));
            }
        }

        CustomUserDetails user = CustomUserDetails.builder()
                .id(userId)
                .email(email)
                .identifier(userId)
                .password("hashed_secret")
                .institutionId(institutionId)
                .fullName("Test " + role)
                .authorities(authorities)
                .active(true)
                .build();

        SecurityContext context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(new UsernamePasswordAuthenticationToken(user, null, authorities));
        SecurityContextHolder.setContext(context);
    }

    public void seedBaseEnvironment() {
        if (!institutionRepository.existsById(TENANT_PRIMARY)) {
            institutionRepository.save(Institution.builder()
                    .id(TENANT_PRIMARY)
                    .name("Apex Institute of Technology")
                    .shortName("APEX")
                    .isActive(true)
                    .createdAt(Instant.now())
                    .updatedAt(Instant.now())
                    .build());
        }

        if (!institutionRepository.existsById(TENANT_FOREIGN)) {
            institutionRepository.save(Institution.builder()
                    .id(TENANT_FOREIGN)
                    .name("Foreign Polytechnic")
                    .shortName("FGN")
                    .isActive(true)
                    .createdAt(Instant.now())
                    .updatedAt(Instant.now())
                    .build());
        }

        if (academicTermRepository.findFirstByInstitutionIdAndIsActiveTrue(TENANT_PRIMARY).isEmpty()) {
            academicTermRepository.save(AcademicTerm.builder()
                    .id("term_2026_2")
                    .institutionId(TENANT_PRIMARY)
                    .academicYearId("ay_2025_2026")
                    .termName("Term 2 (Jan - Apr 2026)")
                    .startDate(LocalDate.of(2026, 1, 5))
                    .endDate(LocalDate.of(2026, 4, 10))
                    .status("ACTIVE")
                    .isActive(true)
                    .createdAt(Instant.now())
                    .build());
        }
    }
}
