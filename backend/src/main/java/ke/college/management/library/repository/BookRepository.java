package ke.college.management.library.repository;

import ke.college.management.library.entity.Book;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookRepository extends JpaRepository<Book, String> {

    Page<Book> findByInstitutionId(String institutionId, Pageable pageable);

    @Query("SELECT b FROM Book b WHERE b.institutionId = :institutionId AND " +
           "(LOWER(b.title) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(b.author) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(b.isbn) LIKE LOWER(CONCAT('%', :search, '%')))")
    List<Book> searchBooks(@Param("institutionId") String institutionId, @Param("search") String search);
}
