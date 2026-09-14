package ke.college.management.academics;

import ke.college.management.academics.dto.LecturerClassDto;
import ke.college.management.academics.dto.LecturerStudentDto;
import ke.college.management.academics.dto.StudentEnrolledCourseDto;
import ke.college.management.academics.entity.Course;
import ke.college.management.academics.entity.CourseEnrollment;
import ke.college.management.academics.repository.CourseEnrollmentRepository;
import ke.college.management.academics.repository.CourseRepository;
import ke.college.management.common.ApiResponse;
import ke.college.management.exceptions.BusinessRuleException;
import ke.college.management.exceptions.UnauthorizedException;
import ke.college.management.finance.FinanceController;
import ke.college.management.students.StudentController;
import ke.college.management.students.entity.Student;
import ke.college.management.students.repository.StudentRepository;
import ke.college.management.testfixtures.TestEnvironmentFixture;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class CourseEnrollmentAndScopingSecurityTests {

    @Autowired
    private StudentController studentController;

    @Autowired
    private LecturerController lecturerController;

    @Autowired
    private FinanceController financeController;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private CourseEnrollmentRepository courseEnrollmentRepository;

    @Autowired
    private TestEnvironmentFixture fixture;

    private Student studentAlice;
    private Student studentDavid;
    private Course courseCs201;
    private Course courseCs202;
    private Course courseOtherProg;

    private static final String LECTURER_BOB_ID = "usr_lect_bob";
    private static final String LECTURER_CAROL_ID = "usr_lect_carol";
    private static final String STUDENT_ALICE_USER_ID = "usr_stu_alice";
    private static final String STUDENT_DAVID_USER_ID = "usr_stu_david";

    @BeforeEach
    void setUp() {
        fixture.seedBaseEnvironment();

        courseCs201 = courseRepository.save(Course.builder()
                .id("crs_test_cs201_" + System.currentTimeMillis())
                .programId("prog_dit")
                .code("CIT2101")
                .name("Database Systems")
                .creditHours(4)
                .semester(2)
                .lecturerUserId(LECTURER_BOB_ID)
                .build());

        courseCs202 = courseRepository.save(Course.builder()
                .id("crs_test_cs202_" + System.currentTimeMillis())
                .programId("prog_dit")
                .code("CIT2102")
                .name("Routing Protocols")
                .creditHours(3)
                .semester(2)
                .lecturerUserId(LECTURER_CAROL_ID)
                .build());

        courseOtherProg = courseRepository.save(Course.builder()
                .id("crs_test_ee301_" + System.currentTimeMillis())
                .programId("prog_deee")
                .code("EEE3101")
                .name("Electrical Circuit Theory")
                .creditHours(4)
                .semester(1)
                .lecturerUserId(LECTURER_CAROL_ID)
                .build());

        studentAlice = studentRepository.save(Student.builder()
                .id("stu_alice_" + System.currentTimeMillis())
                .userId(STUDENT_ALICE_USER_ID)
                .institutionId(TestEnvironmentFixture.TENANT_PRIMARY)
                .campusId("cmp_main")
                .admissionNumber("ADM/ALICE/01")
                .fullName("Alice Wanjiku")
                .gender("FEMALE")
                .programId("prog_dit")
                .currentTermId("term_2026_2")
                .feeBalance(new BigDecimal("15000.00"))
                .status("ACTIVE")
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build());

        studentDavid = studentRepository.save(Student.builder()
                .id("stu_david_" + System.currentTimeMillis())
                .userId(STUDENT_DAVID_USER_ID)
                .institutionId(TestEnvironmentFixture.TENANT_PRIMARY)
                .campusId("cmp_main")
                .admissionNumber("ADM/DAVID/02")
                .fullName("David Ochieng")
                .gender("MALE")
                .programId("prog_dit")
                .currentTermId("term_2026_2")
                .feeBalance(new BigDecimal("22000.00"))
                .status("ACTIVE")
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build());
    }

    @Test
    @DisplayName("P0: Student authoritatively enrolls and drops course using course_enrollments as source of truth")
    void studentEnrollmentAndDrop_AuthoritativeCycle() {
        fixture.authenticateAs(STUDENT_ALICE_USER_ID, "alice@apex.edu", TestEnvironmentFixture.TENANT_PRIMARY, "STUDENT", null);

        // 1. Initially no courses enrolled
        ApiResponse<List<StudentEnrolledCourseDto>> initialCourses = studentController.getMyCourses();
        assertTrue(initialCourses.getData().isEmpty());

        // 2. Enroll in courseCs201
        ApiResponse<StudentEnrolledCourseDto> enrollResponse = studentController.enrollInCourse(courseCs201.getId());
        assertNotNull(enrollResponse.getData());
        assertEquals(courseCs201.getId(), enrollResponse.getData().getCourseId());
        assertEquals("ENROLLED", enrollResponse.getData().getStatus());

        // 3. Verify course_enrollments table has the record
        List<CourseEnrollment> enrollments = courseEnrollmentRepository.findByStudentIdAndStatus(studentAlice.getId(), "ENROLLED");
        assertEquals(1, enrollments.size());
        assertEquals(courseCs201.getId(), enrollments.get(0).getCourseId());

        // 4. Verify getMyCourses returns the enrolled course
        ApiResponse<List<StudentEnrolledCourseDto>> currentCourses = studentController.getMyCourses();
        assertEquals(1, currentCourses.getData().size());
        assertEquals("CIT2101", currentCourses.getData().get(0).getCode());

        // 5. Drop the course
        ApiResponse<Void> dropResponse = studentController.dropCourse(courseCs201.getId());
        assertNotNull(dropResponse);

        // 6. Verify enrollment transitioned to DROPPED
        List<CourseEnrollment> remainingActive = courseEnrollmentRepository.findByStudentIdAndStatus(studentAlice.getId(), "ENROLLED");
        assertTrue(remainingActive.isEmpty());

        ApiResponse<List<StudentEnrolledCourseDto>> afterDropCourses = studentController.getMyCourses();
        assertTrue(afterDropCourses.getData().isEmpty());
    }

    @Test
    @DisplayName("P0: Student cannot enroll in a course outside their academic program")
    void studentCannotEnrollOutsideProgram() {
        fixture.authenticateAs(STUDENT_ALICE_USER_ID, "alice@apex.edu", TestEnvironmentFixture.TENANT_PRIMARY, "STUDENT", null);

        assertThrows(BusinessRuleException.class, () -> {
            studentController.enrollInCourse(courseOtherProg.getId());
        });
    }

    @Test
    @DisplayName("P0: Lecturer only sees students actively enrolled in their assigned courses, omitting unauthorized fields")
    void lecturerScope_StrictlyIsolatedToAssignedCourseEnrollments() {
        // Enroll Alice in Bob's course (crs_cs201)
        courseEnrollmentRepository.save(CourseEnrollment.builder()
                .id("enr_test_alice_bob")
                .studentId(studentAlice.getId())
                .courseId(courseCs201.getId())
                .academicTermId("term_2026_2")
                .status("ENROLLED")
                .build());

        // Enroll David in Carol's course (crs_cs202)
        courseEnrollmentRepository.save(CourseEnrollment.builder()
                .id("enr_test_david_carol")
                .studentId(studentDavid.getId())
                .courseId(courseCs202.getId())
                .academicTermId("term_2026_2")
                .status("ENROLLED")
                .build());

        // Authenticate as Lecturer Bob
        fixture.authenticateAs(LECTURER_BOB_ID, "bob@apex.edu", TestEnvironmentFixture.TENANT_PRIMARY, "LECTURER", null);

        // Bob fetches his classes
        ApiResponse<List<LecturerClassDto>> classesRes = lecturerController.getMyClasses();
        assertEquals(1, classesRes.getData().size());
        assertEquals(1, classesRes.getData().get(0).getEnrolledCount());

        // Bob fetches his students
        ApiResponse<List<LecturerStudentDto>> studentsRes = lecturerController.getMyStudents();
        assertEquals(1, studentsRes.getData().size());

        LecturerStudentDto seenStudent = studentsRes.getData().get(0);
        assertEquals(studentAlice.getId(), seenStudent.getId());
        assertEquals(courseCs201.getId(), seenStudent.getCourseId());
        assertEquals("CIT2101", seenStudent.getCourseCode());

        // Bob MUST NOT see David (who is only in Carol's course)
        boolean sawDavid = studentsRes.getData().stream().anyMatch(s -> s.getId().equals(studentDavid.getId()));
        assertFalse(sawDavid, "Lecturer Bob should not see students not enrolled in his courses!");

        // Bob's workload calculation
        ApiResponse<Map<String, Object>> workloadRes = lecturerController.getMyWorkload();
        assertEquals(1, workloadRes.getData().get("totalCourses"));
        assertEquals(1, workloadRes.getData().get("totalStudents"));
    }

    @Test
    @DisplayName("P0: IDOR Protection on student financial records and profiles")
    void idorProtection_StudentsCannotAccessForeignStudentRecords() {
        // Authenticate as Alice
        fixture.authenticateAs(STUDENT_ALICE_USER_ID, "alice@apex.edu", TestEnvironmentFixture.TENANT_PRIMARY, "STUDENT", null);

        // Alice attempts to access David's profile by ID -> MUST throw UnauthorizedException
        assertThrows(UnauthorizedException.class, () -> {
            studentController.getStudentById(studentDavid.getId());
        });

        // Alice attempts to view David's invoices -> MUST throw UnauthorizedException
        assertThrows(UnauthorizedException.class, () -> {
            financeController.getStudentInvoices(studentDavid.getId());
        });

        // Alice attempts to initiate M-Pesa push on David's studentId -> MUST throw UnauthorizedException
        FinanceController.MpesaInitiateRequest request = new FinanceController.MpesaInitiateRequest();
        request.setStudentId(studentDavid.getId());
        request.setAmount(new BigDecimal("5000.00"));
        request.setPhoneNumber("254712345678");

        assertThrows(UnauthorizedException.class, () -> {
            financeController.initiateMpesaPayment(request);
        });
    }
}
