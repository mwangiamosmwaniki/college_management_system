package ke.college.management.security;

import ke.college.management.exceptions.TenantViolationException;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class SecurityAndTenantIsolationTests {

    @Autowired
    private MockMvc mockMvc;

    @Test
    @DisplayName("P0: Unauthenticated requests to /api/v1/students must be rejected with 401 Unauthorized")
    void unauthenticatedRequest_ReturnsUnauthorized() throws Exception {
        mockMvc.perform(get("/api/v1/students"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("P0: Cross-tenant access between institutions must throw TenantViolationException")
    void crossTenantIsolation_ProhibitsForeignTenantAccess() {
        assertThrows(TenantViolationException.class, () -> {
            SecurityUtils.validateTenantAccess("inst_foreign_polytechnic");
        });
    }

    @Test
    @WithMockUser(username = "student@apex.edu", roles = {"STUDENT"})
    @DisplayName("P0: Privilege escalation attempt by student calling admin status endpoint must return 403 Forbidden")
    void nonAdminUser_CannotEscalateUserStatus() throws Exception {
        mockMvc.perform(put("/api/v1/users/usr_admin/status?status=SUSPENDED"))
                .andExpect(status().isForbidden());
    }
}
