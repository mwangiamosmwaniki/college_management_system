package ke.college.management.institutions.entity;

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
@Table(name = "campuses")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Campus {

    @Id
    @Column(length = 64)
    private String id;

    @Column(name = "institution_id", nullable = false, length = 64)
    private String institutionId;

    @Column(nullable = false, length = 32)
    private String code;

    @Column(nullable = false, length = 255)
    private String name;

    @Column(length = 255)
    private String location;

    @Column(name = "director_name", length = 128)
    private String directorName;

    @Column(name = "created_at")
    @Builder.Default
    private Instant createdAt = Instant.now();
}
