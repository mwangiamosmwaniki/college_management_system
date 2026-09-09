package ke.college.management.procurement.repository;

import ke.college.management.procurement.entity.ProcurementRequisition;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProcurementRequisitionRepository extends JpaRepository<ProcurementRequisition, String> {

    List<ProcurementRequisition> findByInstitutionId(String institutionId);
}
