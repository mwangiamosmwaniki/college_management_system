package ke.college.management.documents.repository;

import ke.college.management.documents.entity.DocumentRecord;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DocumentRepository extends JpaRepository<DocumentRecord, String> {
    Optional<DocumentRecord> findByVerificationCode(String verificationCode);
    Page<DocumentRecord> findByInstitutionId(String institutionId, Pageable pageable);
    Page<DocumentRecord> findByStudentId(String studentId, Pageable pageable);
}
