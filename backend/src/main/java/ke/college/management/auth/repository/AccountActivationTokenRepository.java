package ke.college.management.auth.repository;

import ke.college.management.auth.entity.AccountActivationToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AccountActivationTokenRepository extends JpaRepository<AccountActivationToken, String> {
    Optional<AccountActivationToken> findByTokenHash(String tokenHash);
}
