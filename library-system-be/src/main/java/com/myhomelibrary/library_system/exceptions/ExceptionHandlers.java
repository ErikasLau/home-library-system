package com.myhomelibrary.library_system.exceptions;

import com.google.firebase.auth.FirebaseAuthException;
import com.myhomelibrary.library_system.domains.api.Response;
import com.myhomelibrary.library_system.domains.api.ServerError;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.authorization.AuthorizationDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class ExceptionHandlers {
    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseBody
    public Response<ServerError> handleValidationException(HttpServletResponse response, MethodArgumentNotValidException ex) {
        response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
        Map<String, String> errorMap = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error -> errorMap.put(error.getField(), error.getDefaultMessage()));
        var serverError = new ServerError("Validation Error", errorMap.toString());
        return Response.error(serverError);
    }

    @ExceptionHandler(ResourceAlreadyExistsException.class)
    @ResponseBody
    public Response<ServerError> handleResourceAlreadyExistsException(HttpServletResponse response, ResourceAlreadyExistsException ex) {
        response.setStatus(HttpServletResponse.SC_CONFLICT);
        var serverError = new ServerError("Resource already exists", ex.getMessage());
        return Response.error(serverError);
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    @ResponseBody
    public Response<ServerError> handleDataIntegrityViolationException(HttpServletResponse response, DataIntegrityViolationException ex) {
        response.setStatus(HttpServletResponse.SC_CONFLICT);
        var serverError = new ServerError("Data Integrity Violation", null);
        return Response.error(serverError);
    }

    @ExceptionHandler(NotFoundException.class)
    @ResponseBody
    public Response<ServerError> handleNotFoundException(HttpServletResponse response, NotFoundException ex) {
        response.setStatus(HttpServletResponse.SC_NOT_FOUND);
        var serverError = new ServerError("Resource not found", ex.getMessage());
        return Response.error(serverError);
    }

    @ExceptionHandler(UnauthorizedException.class)
    @ResponseBody
    public void handleNotAuthorized(HttpServletResponse response) {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
    }

    @ExceptionHandler(ForbiddenException.class)
    @ResponseBody
    public void handleForbidden(HttpServletResponse response) {
        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
    }

    @ExceptionHandler(FirebaseServiceException.class)
    @ResponseBody
    public Response<ServerError> handleFirebaseServiceException(HttpServletResponse response, FirebaseServiceException ex) {
        FirebaseAuthException firebaseEx = ex.getFirebaseAuthException();

        if (firebaseEx != null && firebaseEx.getAuthErrorCode() != null) {
            String errorCode = firebaseEx.getAuthErrorCode().name();

            switch (errorCode) {
                case "EMAIL_EXISTS":
                case "EMAIL_ALREADY_EXISTS":
                    response.setStatus(HttpServletResponse.SC_CONFLICT);
                    var emailExistsError = new ServerError("Email Already Exists", "An account with this email address already exists. Please use a different email or try logging in.");
                    return Response.error(emailExistsError);

                case "WEAK_PASSWORD":
                    response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                    var weakPasswordError = new ServerError("Weak Password", "Password is too weak. Please choose a stronger password with at least 6 characters.");
                    return Response.error(weakPasswordError);

                case "INVALID_EMAIL":
                    response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                    var invalidEmailError = new ServerError("Invalid Email", "The email address format is invalid. Please enter a valid email address.");
                    return Response.error(invalidEmailError);

                case "TOO_MANY_REQUESTS":
                    response.setStatus(429);
                    var tooManyRequestsError = new ServerError("Too Many Requests", "Too many requests. Please wait a moment before trying again.");
                    return Response.error(tooManyRequestsError);

                case "OPERATION_NOT_ALLOWED":
                    response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                    var operationNotAllowedError = new ServerError("Operation Not Allowed", "This operation is not currently allowed. Please contact support.");
                    return Response.error(operationNotAllowedError);

                default:
                    response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                    var defaultFirebaseError = new ServerError("Firebase Authentication Error", ex.getMessage());
                    return Response.error(defaultFirebaseError);
            }
        }

        response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
        var serverError = new ServerError("Firebase Service Error", ex.getMessage());
        return Response.error(serverError);
    }

    @ExceptionHandler(FirebaseAuthException.class)
    @ResponseBody
    public Response<ServerError> handleFirebaseAuthException(HttpServletResponse response, FirebaseAuthException ex) {
        if (ex.getAuthErrorCode() != null && ex.getAuthErrorCode().name().equals("EMAIL_EXISTS")) {
            response.setStatus(HttpServletResponse.SC_CONFLICT);
            var serverError = new ServerError("Email already exists", ex.getMessage());
            return Response.error(serverError);
        }

        response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
        var serverError = new ServerError("Authentication Error", ex.getMessage());
        return Response.error(serverError);
    }

    @ExceptionHandler(AuthenticationException.class)
    @ResponseBody
    public Response<ServerError> handleAuthenticationException(HttpServletResponse response, AuthenticationException ex) {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        var serverError = new ServerError("Authentication Failed", ex.getMessage());
        return Response.error(serverError);
    }

    @ExceptionHandler(InvalidCredentialsException.class)
    @ResponseBody
    public Response<ServerError> handleInvalidCredentialsException(HttpServletResponse response, InvalidCredentialsException ex) {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        var serverError = new ServerError("Invalid Credentials", ex.getMessage());
        return Response.error(serverError);
    }

    @ExceptionHandler(UserAccountDisabledException.class)
    @ResponseBody
    public Response<ServerError> handleUserAccountDisabledException(HttpServletResponse response, UserAccountDisabledException ex) {
        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
        var serverError = new ServerError("Account Disabled", ex.getMessage());
        return Response.error(serverError);
    }

    @ExceptionHandler(TooManyAttemptsException.class)
    @ResponseBody
    public Response<ServerError> handleTooManyAttemptsException(HttpServletResponse response, TooManyAttemptsException ex) {
        response.setStatus(429);
        var serverError = new ServerError("Too Many Attempts", ex.getMessage());
        return Response.error(serverError);
    }

    @ExceptionHandler(TokenValidationException.class)
    @ResponseBody
    public Response<ServerError> handleTokenValidationException(HttpServletResponse response, TokenValidationException ex) {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        var serverError = new ServerError("Token Validation Failed", ex.getMessage());
        return Response.error(serverError);
    }

    @ExceptionHandler(UserRegistrationException.class)
    @ResponseBody
    public Response<ServerError> handleUserRegistrationException(HttpServletResponse response, UserRegistrationException ex) {
        response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
        var serverError = new ServerError("Registration Failed", ex.getMessage());
        return Response.error(serverError);
    }

    @ExceptionHandler(AuthorizationDeniedException.class)
    @ResponseBody
    public void handleAuthorizationDeniedException(HttpServletResponse response, AuthorizationDeniedException ex) {
        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
    }

    @ExceptionHandler(Exception.class)
    @ResponseBody
    public Response<ServerError> handleGeneralException(HttpServletResponse response, Exception ex) {
        response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        var serverError = new ServerError("Internal Server Error", null);
        return Response.error(serverError);
    }
}
