package ke.college.management.hostel.repository;

import ke.college.management.hostel.entity.Hostel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HostelRepository extends JpaRepository<Hostel, String> {

    List<Hostel> findByInstitutionId(String institutionId);

    java.util.Optional<Hostel> findByIdAndInstitutionId(String id, String institutionId);
}
