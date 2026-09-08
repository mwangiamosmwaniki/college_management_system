package ke.college.management.users.repository;

import ke.college.management.users.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {

    @Query("SELECT u FROM User u WHERE (LOWER(u.email) = LOWER(:login) OR LOWER(u.identifier) = LOWER(:login))")
    Optional<User> findByEmailOrIdentifier(@Param("login") String login);

    @Query("SELECT u FROM User u WHERE u.institutionId = :institutionId AND (LOWER(u.email) = LOWER(:login) OR LOWER(u.identifier) = LOWER(:login))")
    Optional<User> findByInstitutionIdAndLogin(@Param("institutionId") String institutionId, @Param("login") String login);

    Page<User> findByInstitutionId(String institutionId, Pageable pageable);

    @Query("SELECT u FROM User u WHERE u.institutionId = :institutionId AND " +
           "(LOWER(u.fullName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(u.identifier) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(u.email) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<User> searchUsers(@Param("institutionId") String institutionId, @Param("search") String search, Pageable pageable);
}
