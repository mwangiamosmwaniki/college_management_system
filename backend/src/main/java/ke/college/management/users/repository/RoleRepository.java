package ke.college.management.users.repository;

import ke.college.management.users.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role, String> {
    Optional<Role> findByInstitutionIdAndCode(String institutionId, String code);
    Optional<Role> findByCode(String code);
}
