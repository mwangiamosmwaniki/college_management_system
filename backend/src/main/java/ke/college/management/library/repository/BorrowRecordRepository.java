package ke.college.management.library.repository;

import ke.college.management.library.entity.BorrowRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BorrowRecordRepository extends JpaRepository<BorrowRecord, String> {

    List<BorrowRecord> findByUserId(String userId);

    List<BorrowRecord> findByInstitutionId(String institutionId);
}
