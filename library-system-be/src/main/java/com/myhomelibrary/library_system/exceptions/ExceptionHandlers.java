package com.myhomelibrary.library_system.exceptions;

import com.google.firebase.auth.FirebaseAuthException;
import com.myhomelibrary.library_system.domains.api.Response;
import com.myhomelibrary.library_system.domains.api.ServerError;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@Slf4j
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
        log.error(ex.getMessage(), ex);
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
        log.error("Firebase Service Error: {}", ex.getMessage(), ex);

        if (firebaseEx != null && firebaseEx.getAuthErrorCode() != null &&
                firebaseEx.getAuthErrorCode().name().equals("EMAIL_EXISTS")) {
            response.setStatus(HttpServletResponse.SC_CONFLICT);
            var serverError = new ServerError("Email already exists in Firebase", "A user with this email already exists");
            return Response.error(serverError);
        }

        response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
        var serverError = new ServerError("Firebase Authentication Error", ex.getMessage());
        return Response.error(serverError);
    }

    @ExceptionHandler(FirebaseAuthException.class)
    @ResponseBody
    public Response<ServerError> handleFirebaseAuthException(HttpServletResponse response, FirebaseAuthException ex) {
        log.error("Firebase Auth Error: {}", ex.getMessage(), ex);

        if (ex.getAuthErrorCode() != null && ex.getAuthErrorCode().name().equals("EMAIL_EXISTS")) {
            response.setStatus(HttpServletResponse.SC_CONFLICT);
            var serverError = new ServerError("Email already exists", ex.getMessage());
            return Response.error(serverError);
        }

        response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
        var serverError = new ServerError("Authentication Error", ex.getMessage());
        return Response.error(serverError);
    }

    @ExceptionHandler(Exception.class)
    @ResponseBody
    public Response<ServerError> handleGeneralException(HttpServletResponse response, Exception ex) {
        log.error(ex.getMessage(), ex);
        response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        var serverError = new ServerError("Internal Server Error", null);
        return Response.error(serverError);
    }
}
