package ke.college.management.auth;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import ke.college.management.auth.dto.AuthResponse;
import ke.college.management.auth.dto.ChangePasswordRequest;
import ke.college.management.auth.dto.ForgotPasswordRequest;
import ke.college.management.auth.dto.LoginRequest;
import ke.college.management.auth.dto.ResetPasswordRequest;
import ke.college.management.auth.dto.UserDto;
import ke.college.management.common.ApiResponse;
import lombok.RequiredArgsConstructor;
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
    @Operation(summary = "Invalidate active session and clear session cookie with audit recording")
    public ApiResponse<Void> logout(HttpServletRequest request, HttpServletResponse response) {
        authService.logout(request, response);
        return ApiResponse.success("Successfully logged out", null);
    }

    @PostMapping("/change-password")
    @Operation(summary = "Change password for the currently authenticated user")
    public ApiResponse<Void> changePassword(
            @Valid @RequestBody ChangePasswordRequest request,
            HttpServletRequest httpRequest
    ) {
        authService.changePassword(request, httpRequest);
        return ApiResponse.success("Password changed successfully", null);
    }

    @PostMapping("/forgot-password")
    @Operation(summary = "Initiate password reset request with short-lived token")
    public ApiResponse<Void> forgotPassword(
            @Valid @RequestBody ForgotPasswordRequest request,
            HttpServletRequest httpRequest
    ) {
        authService.forgotPassword(request, httpRequest);
        return ApiResponse.success("If the account exists, password reset instructions have been dispatched.", null);
    }

    @PostMapping("/reset-password")
    @Operation(summary = "Reset password using one-time token")
    public ApiResponse<Void> resetPassword(
            @Valid @RequestBody ResetPasswordRequest request,
            HttpServletRequest httpRequest
    ) {
        authService.resetPassword(request, httpRequest);
        return ApiResponse.success("Password reset successfully. You may now login.", null);
    }
}
