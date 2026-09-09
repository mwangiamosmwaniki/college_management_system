package ke.college.management.hr;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import ke.college.management.audit.AuditService;
import ke.college.management.common.ApiResponse;
import ke.college.management.exceptions.ResourceNotFoundException;
import ke.college.management.hr.entity.Employee;
import ke.college.management.hr.entity.LeaveRequest;
import ke.college.management.hr.entity.PayrollBatch;
import ke.college.management.hr.repository.EmployeeRepository;
import ke.college.management.hr.repository.LeaveRequestRepository;
import ke.college.management.hr.repository.PayrollBatchRepository;
import ke.college.management.security.SecurityUtils;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/hr")
@RequiredArgsConstructor
@Tag(name = "HR & Payroll", description = "Human resources, staff registry, leave approvals and payroll batch execution")
public class HrController {

    private final EmployeeRepository employeeRepository;
    private final LeaveRequestRepository leaveRequestRepository;
    private final PayrollBatchRepository payrollBatchRepository;
    private final AuditService auditService;

    @GetMapping("/employees")
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('HR_MANAGE')")
    @Operation(summary = "Get list of staff employees")
    public ApiResponse<List<Employee>> getEmployees() {
        return ApiResponse.success(employeeRepository.findByInstitutionId(SecurityUtils.getCurrentInstitutionId()));
    }

    @PostMapping("/employees")
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('HR_MANAGE')")
    @Operation(summary = "Register new staff employee")
    public ApiResponse<Employee> createEmployee(@RequestBody Employee employee) {
        employee.setId("emp_" + UUID.randomUUID().toString().replace("-", "").substring(0, 16));
        employee.setInstitutionId(SecurityUtils.getCurrentInstitutionId());
        employee.setCreatedAt(Instant.now());
        Employee saved = employeeRepository.save(employee);
        return ApiResponse.success("Employee registered successfully", saved);
    }

    @GetMapping("/leave")
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('HR_MANAGE')")
    @Operation(summary = "List institutional leave requests")
    public ApiResponse<List<LeaveRequest>> getLeaveRequests() {
        return ApiResponse.success(leaveRequestRepository.findByInstitutionId(SecurityUtils.getCurrentInstitutionId()));
    }

    @PostMapping("/leave")
    @Operation(summary = "Submit a staff leave request")
    public ApiResponse<LeaveRequest> submitLeave(@RequestBody LeaveRequest request) {
        request.setId("lev_" + UUID.randomUUID().toString().replace("-", "").substring(0, 16));
        request.setInstitutionId(SecurityUtils.getCurrentInstitutionId());
        request.setStatus("PENDING");
        request.setCreatedAt(Instant.now());
        LeaveRequest saved = leaveRequestRepository.save(request);
        return ApiResponse.success("Leave request submitted", saved);
    }

    @PutMapping("/leave/{id}/decision")
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('HR_MANAGE')")
    @Operation(summary = "Approve or reject leave request")
    public ApiResponse<LeaveRequest> decideLeave(
            @PathVariable String id,
            @RequestParam String status
    ) {
        LeaveRequest leave = leaveRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Leave request not found"));

        leave.setStatus(status.toUpperCase());
        leave.setReviewedBy(SecurityUtils.getCurrentUserId());
        LeaveRequest saved = leaveRequestRepository.save(leave);
        return ApiResponse.success("Leave request " + status, saved);
    }

    @GetMapping("/payroll")
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('FINANCE_MANAGE') or hasAuthority('HR_MANAGE')")
    @Operation(summary = "List institutional payroll runs")
    public ApiResponse<List<PayrollBatch>> getPayrollBatches() {
        return ApiResponse.success(payrollBatchRepository.findByInstitutionId(SecurityUtils.getCurrentInstitutionId()));
    }

    @PostMapping("/payroll/generate")
    @PreAuthorize("hasRole('ADMIN') or hasAuthority('FINANCE_MANAGE')")
    @Transactional
    @Operation(summary = "Compute and generate monthly payroll batch")
    public ApiResponse<PayrollBatch> generatePayroll(@RequestParam String monthYear) {
        String institutionId = SecurityUtils.getCurrentInstitutionId();
        List<Employee> employees = employeeRepository.findByInstitutionId(institutionId);

        BigDecimal totalGross = employees.stream()
                .map(Employee::getBasicSalary)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Approximate net pay after statutory deductions (PAYE, NSSF, SHIF)
        BigDecimal totalNet = totalGross.multiply(BigDecimal.valueOf(0.75));

        PayrollBatch batch = PayrollBatch.builder()
                .id("pyr_" + UUID.randomUUID().toString().replace("-", "").substring(0, 16))
                .institutionId(institutionId)
                .monthYear(monthYear)
                .totalGross(totalGross)
                .totalNet(totalNet)
                .status("APPROVED")
                .processedBy(SecurityUtils.getCurrentUserId())
                .createdAt(Instant.now())
                .build();

        PayrollBatch saved = payrollBatchRepository.save(batch);
        return ApiResponse.success("Payroll batch generated for " + monthYear, saved);
    }
}
