package ke.college.management.institutions.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Version;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Entity
@Table(name = "institutions")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Institution {

    @Id
    @Column(length = 64)
    private String id;

    @Column(nullable = false, length = 255)
    private String name;

    @Column(name = "short_name", nullable = false, length = 64)
    private String shortName;

    @Column(length = 255)
    private String motto;

    @Column(name = "registration_number", unique = true, length = 128)
    private String registrationNumber;

    @Column(name = "accreditation_body", length = 128)
    private String accreditationBody;

    @Column(name = "primary_color", length = 32)
    @Builder.Default
    private String primaryColor = "#2563eb";

    @Column(length = 16)
    @Builder.Default
    private String currency = "KES";

    @Column(name = "is_active")
    @Builder.Default
    private Boolean isActive = true;

    @Column(name = "created_at", updatable = false)
    @Builder.Default
    private Instant createdAt = Instant.now();

    @Column(name = "updated_at")
    @Builder.Default
    private Instant updatedAt = Instant.now();

    @Version
    private Long version;
}
