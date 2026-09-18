package ke.college.management.publicinquiry.repository;

import ke.college.management.publicinquiry.entity.PublicInquiry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PublicInquiryRepository extends JpaRepository<PublicInquiry, String> {

    Optional<PublicInquiry> findByReferenceNumber(String referenceNumber);
}
