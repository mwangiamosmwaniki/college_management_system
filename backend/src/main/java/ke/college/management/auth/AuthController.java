package ke.college.management.auth;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import ke.college.management.auth.dto.AuthResponse;
import ke.college.management.auth.dto.LoginRequest;
import ke.college.management.auth.dto.UserDto;
import ke.college.management.common.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Institutional authentication and session endpoints")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    @Operation(summary = "Authenticate user with institutional credentials and establish secure HTTP session")
    public ApiResponse<AuthResponse> login(
            @Valid @RequestBody LoginRequest request,
            HttpServletRequest httpRequest
    ) {
        AuthResponse response = authService.authenticate(request, httpRequest);
        return ApiResponse.success("Authenticated successfully", response);
    }

    @GetMapping("/me")
    @Operation(summary = "Get current authenticated user profile and permissions")
    public ApiResponse<UserDto> getCurrentUser() {
        UserDto currentUser = authService.getCurrentUser();
        return ApiResponse.success(currentUser);
    }

    @PostMapping("/logout")
    @Operation(summary = "Invalidate active session and logout")
    public ApiResponse<Void> logout(HttpServletRequest request, HttpServletResponse response) {
        var session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }
        SecurityContextHolder.clearContext();
        return ApiResponse.success("Successfully logged out", null);
    }
}
