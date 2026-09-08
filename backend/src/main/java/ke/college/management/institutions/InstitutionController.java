package ke.college.management.institutions;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import ke.college.management.common.ApiResponse;
import ke.college.management.exceptions.ResourceNotFoundException;
import ke.college.management.institutions.entity.Institution;
import ke.college.management.institutions.repository.InstitutionRepository;
import ke.college.management.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;

@RestController
@RequestMapping("/api/v1/institutions")
@RequiredArgsConstructor
@Tag(name = "Institutions", description = "Institutional settings, branding and parameters")
public class InstitutionController {

    private final InstitutionRepository institutionRepository;

    @GetMapping("/current")
    @Operation(summary = "Get current authenticated institution configuration")
    public ApiResponse<Institution> getCurrentInstitution() {
        String institutionId = SecurityUtils.getCurrentInstitutionId();
        Institution inst = institutionRepository.findById(institutionId)
                .orElseThrow(() -> new ResourceNotFoundException("Institution not found for ID: " + institutionId));
        return ApiResponse.success(inst);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('SETTINGS_MANAGE') or hasRole('ADMIN')")
    @Operation(summary = "Update institutional settings and heraldry")
    public ApiResponse<Institution> updateInstitution(
            @PathVariable String id,
            @RequestBody Institution updated
    ) {
        // Enforce strict tenant isolation: user can only update their own institution
        SecurityUtils.validateTenantAccess(id);

        Institution inst = institutionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Institution not found for ID: " + id));

        if (updated.getName() != null) inst.setName(updated.getName());
        if (updated.getShortName() != null) inst.setShortName(updated.getShortName());
        if (updated.getMotto() != null) inst.setMotto(updated.getMotto());
        if (updated.getPrimaryColor() != null) inst.setPrimaryColor(updated.getPrimaryColor());
        if (updated.getCurrency() != null) inst.setCurrency(updated.getCurrency());
        inst.setUpdatedAt(Instant.now());

        Institution saved = institutionRepository.save(inst);
        return ApiResponse.success("Institution configuration updated successfully", saved);
    }
}
