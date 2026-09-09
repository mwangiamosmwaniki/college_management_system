package ke.college.management.library;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import ke.college.management.audit.AuditService;
import ke.college.management.common.ApiResponse;
import ke.college.management.common.PageResponse;
import ke.college.management.exceptions.BadRequestException;
import ke.college.management.exceptions.ResourceNotFoundException;
import ke.college.management.library.entity.Book;
import ke.college.management.library.entity.BorrowRecord;
import ke.college.management.library.repository.BookRepository;
import ke.college.management.library.repository.BorrowRecordRepository;
import ke.college.management.security.SecurityUtils;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/library")
@RequiredArgsConstructor
@Tag(name = "Library", description = "Library catalogue, borrowing, book returns and overdue fine assessment")
public class LibraryController {

    private final BookRepository bookRepository;
    private final BorrowRecordRepository borrowRecordRepository;
    private final AuditService auditService;

    @GetMapping("/books")
    @Operation(summary = "Search library book catalogue")
    public ApiResponse<PageResponse<Book>> getBooks(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String search
    ) {
        String institutionId = SecurityUtils.getCurrentInstitutionId();
        PageRequest pageable = PageRequest.of(page, size, Sort.by("title").ascending());
        Page<Book> bookPage = bookRepository.findByInstitutionId(institutionId, pageable);
        return ApiResponse.success(PageResponse.from(bookPage));
    }

    @PostMapping("/books")
    @PreAuthorize("hasAuthority('LIBRARY_MANAGE') or hasRole('ADMIN')")
    @Operation(summary = "Add new book to catalogue")
    public ApiResponse<Book> addBook(@RequestBody Book book) {
        book.setId("bk_" + UUID.randomUUID().toString().replace("-", "").substring(0, 16));
        book.setInstitutionId(SecurityUtils.getCurrentInstitutionId());
        book.setCreatedAt(Instant.now());
        if (book.getAvailableCopies() == null) {
            book.setAvailableCopies(book.getTotalCopies());
        }
        Book saved = bookRepository.save(book);
        return ApiResponse.success("Book added to catalogue", saved);
    }

    @PostMapping("/borrow")
    @PreAuthorize("hasAuthority('LIBRARY_MANAGE') or hasRole('ADMIN')")
    @Transactional
    @Operation(summary = "Check out a book copy to a borrower")
    public ApiResponse<BorrowRecord> borrowBook(@RequestBody BorrowRequest request) {
        String institutionId = SecurityUtils.getCurrentInstitutionId();
        Book book = bookRepository.findById(request.getBookId())
                .orElseThrow(() -> new ResourceNotFoundException("Book not found"));

        if (book.getAvailableCopies() == null || book.getAvailableCopies() <= 0) {
            throw new BadRequestException("No available copies to borrow");
        }

        book.setAvailableCopies(book.getAvailableCopies() - 1);
        bookRepository.save(book);

        BorrowRecord record = BorrowRecord.builder()
                .id("brw_" + UUID.randomUUID().toString().replace("-", "").substring(0, 16))
                .institutionId(institutionId)
                .copyId(book.getId())
                .userId(request.getUserId())
                .borrowedAt(Instant.now())
                .dueDate(Instant.now().plus(14, ChronoUnit.DAYS))
                .fineAmount(BigDecimal.ZERO)
                .status("ACTIVE")
                .build();

        BorrowRecord saved = borrowRecordRepository.save(record);
        return ApiResponse.success("Book borrowed successfully. Due in 14 days.", saved);
    }

    @PostMapping("/return/{recordId}")
    @PreAuthorize("hasAuthority('LIBRARY_MANAGE') or hasRole('ADMIN')")
    @Transactional
    @Operation(summary = "Return borrowed book and calculate overdue fine if applicable")
    public ApiResponse<BorrowRecord> returnBook(@PathVariable String recordId) {
        BorrowRecord record = borrowRecordRepository.findById(recordId)
                .orElseThrow(() -> new ResourceNotFoundException("Borrow record not found"));

        if ("RETURNED".equals(record.getStatus())) {
            throw new BadRequestException("Book has already been returned");
        }

        record.setReturnedAt(Instant.now());
        record.setStatus("RETURNED");

        // Calculate fine if overdue (e.g., 20 KES per day overdue)
        if (record.getReturnedAt().isAfter(record.getDueDate())) {
            long overdueDays = ChronoUnit.DAYS.between(record.getDueDate(), record.getReturnedAt());
            if (overdueDays > 0) {
                record.setFineAmount(BigDecimal.valueOf(overdueDays * 20));
            }
        }

        bookRepository.findById(record.getCopyId()).ifPresent(book -> {
            book.setAvailableCopies((book.getAvailableCopies() != null ? book.getAvailableCopies() : 0) + 1);
            bookRepository.save(book);
        });

        BorrowRecord saved = borrowRecordRepository.save(record);
        return ApiResponse.success("Book returned. Overdue fine: KES " + saved.getFineAmount(), saved);
    }

    @GetMapping("/records/user/{userId}")
    @Operation(summary = "Get user borrowing history")
    public ApiResponse<List<BorrowRecord>> getUserRecords(@PathVariable String userId) {
        return ApiResponse.success(borrowRecordRepository.findByUserId(userId));
    }

    @Data
    public static class BorrowRequest {
        private String bookId;
        private String userId;
    }
}
