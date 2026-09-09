package ke.college.management.hostel.repository;

import ke.college.management.hostel.entity.HostelAllocation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HostelAllocationRepository extends JpaRepository<HostelAllocation, String> {

    List<HostelAllocation> findByStudentId(String studentId);

    List<HostelAllocation> findByInstitutionId(String institutionId);
}
