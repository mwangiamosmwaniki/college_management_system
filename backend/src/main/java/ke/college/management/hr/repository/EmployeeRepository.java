package ke.college.management.hr.repository;

import ke.college.management.hr.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, String> {

    List<Employee> findByInstitutionId(String institutionId);

    Optional<Employee> findByUserId(String userId);

    Optional<Employee> findByInstitutionIdAndStaffNumber(String institutionId, String staffNumber);
}
