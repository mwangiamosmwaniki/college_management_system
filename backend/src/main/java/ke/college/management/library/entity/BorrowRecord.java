package ke.college.management.library.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "borrow_records")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BorrowRecord {

    @Id
    private String id;

    @Column(name = "institution_id", nullable = false)
    private String institutionId;

    @Column(name = "copy_id", nullable = false)
    private String copyId;

    @Column(name = "user_id", nullable = false)
    private String userId;

    @Column(name = "borrowed_at", nullable = false)
    private Instant borrowedAt;

    @Column(name = "due_date", nullable = false)
    private Instant dueDate;

    @Column(name = "returned_at")
    private Instant returnedAt;

    @Column(name = "fine_amount", precision = 8, scale = 2)
    private BigDecimal fineAmount;

    @Column(length = 32)
    private String status; // ACTIVE, RETURNED, OVERDUE, LOST
}
