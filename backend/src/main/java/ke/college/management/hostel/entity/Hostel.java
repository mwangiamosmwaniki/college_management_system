package ke.college.management.hostel.entity;

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
@Table(name = "hostels")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Hostel {

    @Id
    private String id;

    @Column(name = "institution_id", nullable = false)
    private String institutionId;

    @Column(name = "campus_id")
    private String campusId;

    @Column(nullable = false)
    private String name;

    @Column(name = "gender_policy", nullable = false)
    private String genderPolicy; // MALE, FEMALE, MIXED

    @Column(nullable = false)
    private Integer capacity;

    @Column(name = "created_at")
    private Instant createdAt;
}
