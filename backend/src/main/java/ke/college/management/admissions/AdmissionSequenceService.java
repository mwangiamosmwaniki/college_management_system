package ke.college.management.admissions;

import ke.college.management.admissions.entity.AdmissionSequence;
import ke.college.management.admissions.repository.AdmissionSequenceRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDate;

@Service
@RequiredArgsConstructor
@Slf4j
public class AdmissionSequenceService {

    private final AdmissionSequenceRepository sequenceRepository;

    /**
     * Generates an atomic, concurrency-safe, institution-scoped, year-scoped
     * admission number in the authoritative format: ADM/{YEAR}/{000001}
     */
    @Transactional(propagation = Propagation.MANDATORY)
    public String generateNextAdmissionNumber(String institutionId, int year) {
        AdmissionSequence sequence = sequenceRepository.findForUpdate(institutionId, year)
                .orElseGet(() -> {
                    // Initialize if not present
                    AdmissionSequence newSeq = AdmissionSequence.builder()
                            .institutionId(institutionId)
                            .academicYear(year)
                            .lastValue(0L)
                            .createdAt(Instant.now())
                            .updatedAt(Instant.now())
                            .build();
                    return sequenceRepository.saveAndFlush(newSeq);
                });

        long nextVal = sequence.getLastValue() + 1;
        sequence.setLastValue(nextVal);
        sequence.setUpdatedAt(Instant.now());
        sequenceRepository.saveAndFlush(sequence);

        String generated = String.format("ADM/%d/%06d", year, nextVal);
        log.info("Generated authoritative admission number: {} for institution {} and year {}",
                generated, institutionId, year);
        return generated;
    }

    @Transactional(propagation = Propagation.MANDATORY)
    public String generateNextAdmissionNumber(String institutionId) {
        return generateNextAdmissionNumber(institutionId, LocalDate.now().getYear());
    }
}
