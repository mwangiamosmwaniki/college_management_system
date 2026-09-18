package ke.college.management.publicinquiry.entity;

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
@Table(name = "public_inquiries")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PublicInquiry {

    @Id
    @Column(length = 64)
    private String id;

    @Column(nullable = false, length = 128)
    private String name;

    @Column(nullable = false, length = 128)
    private String email;

    @Column(nullable = false, length = 32)
    private String phone;

    @Column(nullable = false, length = 64)
    @Builder.Default
    private String department = "ADMISSIONS";

    @Column(nullable = false, length = 256)
    private String subject;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;

    @Column(nullable = false, length = 32)
    @Builder.Default
    private String status = "PENDING";

    @Column(name = "reference_number", nullable = false, unique = true, length = 64)
    private String referenceNumber;

    @Column(name = "client_ip", length = 64)
    private String clientIp;

    @Column(name = "created_at", nullable = false)
    @Builder.Default
    private Instant createdAt = Instant.now();

    @Column(name = "updated_at", nullable = false)
    @Builder.Default
    private Instant updatedAt = Instant.now();
}
