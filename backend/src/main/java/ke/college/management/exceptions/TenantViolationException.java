package ke.college.management.exceptions;

public class TenantViolationException extends RuntimeException {
    public TenantViolationException(String message) {
        super(message);
    }
}
