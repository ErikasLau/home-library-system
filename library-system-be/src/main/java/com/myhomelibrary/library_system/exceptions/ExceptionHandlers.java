package com.myhomelibrary.library_system.exceptions;

import com.myhomelibrary.library_system.domains.api.Response;
import com.myhomelibrary.library_system.domains.api.ServerError;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
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
        ex.getBindingResult().getFieldErrors().forEach(error -> {
            errorMap.put(error.getField(),error.getDefaultMessage());
        });
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

    @ExceptionHandler(NotFoundException.class)
    @ResponseBody
    public Response<ServerError> handleNotFoundException(HttpServletResponse response, NotFoundException ex) {
        response.setStatus(HttpServletResponse.SC_NOT_FOUND);
        var serverError = new ServerError("Resource not found", ex.getMessage());
        return Response.error(serverError);
    }

    @ExceptionHandler(UnauthorizedException.class)
    @ResponseBody
    public Response<ServerError> handleNotFoundException(HttpServletResponse response) {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        return Response.error(null);
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
