package ke.college.management.exceptions;

import jakarta.servlet.RequestDispatcher;
import jakarta.servlet.http.HttpServletRequest;
import ke.college.management.common.ApiResponse;
import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import java.util.UUID;

/**
 * Ensures that unauthorized or unmapped requests to the Spring Boot backend
 * always return clean application/json rather than HTML error pages or index redirects.
 */
@RestController
public class CustomErrorController implements ErrorController {

    @RequestMapping(value = "/error", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ApiResponse<Void>> handleError(HttpServletRequest request) {
        Object status = request.getAttribute(RequestDispatcher.ERROR_STATUS_CODE);
        Object message = request.getAttribute(RequestDispatcher.ERROR_MESSAGE);
        Object exception = request.getAttribute(RequestDispatcher.ERROR_EXCEPTION);

        int statusCode = HttpStatus.INTERNAL_SERVER_ERROR.value();
        if (status != null) {
            try {
                statusCode = Integer.parseInt(status.toString());
            } catch (NumberFormatException ignored) {
            }
        }

        HttpStatus httpStatus = HttpStatus.resolve(statusCode);
        if (httpStatus == null) {
            httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
        }

        String userFriendlyMessage;
        if (httpStatus == HttpStatus.UNAUTHORIZED) {
            userFriendlyMessage = "Institutional authentication required. Please log in.";
        } else if (httpStatus == HttpStatus.FORBIDDEN) {
            userFriendlyMessage = "Access Denied: You do not have permission to access this resource.";
        } else if (httpStatus == HttpStatus.NOT_FOUND) {
            userFriendlyMessage = "Requested API endpoint or resource not found.";
        } else {
            userFriendlyMessage = message != null && !message.toString().isBlank()
                    ? message.toString()
                    : "Institutional server error occurred.";
        }

        String requestId = UUID.randomUUID().toString();
        ApiResponse<Void> body = ApiResponse.error(
                userFriendlyMessage,
                Map.of("status", String.valueOf(statusCode)),
                requestId
        );

        return ResponseEntity.status(httpStatus).body(body);
    }
}
