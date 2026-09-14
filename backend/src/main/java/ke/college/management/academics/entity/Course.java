package ke.college.management.academics.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Entity
@Table(name = "courses")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Course {

    @Id
    @Column(length = 64)
    private String id;

    @Column(name = "program_id", nullable = false, length = 64)
    private String programId;

    @Column(nullable = false, length = 32)
    private String code;

    @Column(nullable = false, length = 255)
    private String name;

    @Column(name = "credit_hours")
    @Builder.Default
    private Integer creditHours = 3;

    @Builder.Default
    private Integer semester = 1;

    @Column(name = "lecturer_user_id", length = 64)
    private String lecturerUserId;

    @Column(name = "created_at")
    @Builder.Default
    private Instant createdAt = Instant.now();
}
