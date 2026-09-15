package ke.college.management.academics.service;

import ke.college.management.academics.entity.AcademicTerm;
import ke.college.management.academics.repository.AcademicTermRepository;
import ke.college.management.exceptions.BusinessRuleException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AcademicTermService {

    private final AcademicTermRepository academicTermRepository;

    /**
     * Resolves the authoritative current active academic term for an institution.
     * Throws BusinessRuleException if no active term exists - never silently falls back to a hardcoded string.
     */
    public AcademicTerm getCurrentActiveTerm(String institutionId) {
        return academicTermRepository.findFirstByInstitutionIdAndIsActiveTrue(institutionId)
                .orElseThrow(() -> new BusinessRuleException("No active academic term configured for institution: " + institutionId));
    }

    /**
     * Returns the active academic term if one is configured for the institution.
     */
    public Optional<AcademicTerm> findCurrentActiveTerm(String institutionId) {
        return academicTermRepository.findFirstByInstitutionIdAndIsActiveTrue(institutionId);
    }
}
