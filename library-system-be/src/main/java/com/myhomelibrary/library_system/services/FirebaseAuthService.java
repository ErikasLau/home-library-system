package com.myhomelibrary.library_system.services;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.myhomelibrary.library_system.configs.FirebaseProperties;
import com.myhomelibrary.library_system.domains.firebase.FirebaseErrorResponse;
import com.myhomelibrary.library_system.domains.firebase.FirebaseRefreshTokenResponse;
import com.myhomelibrary.library_system.domains.firebase.FirebaseSignInRequest;
import com.myhomelibrary.library_system.domains.firebase.FirebaseSignInResponse;
import com.myhomelibrary.library_system.exceptions.AuthenticationException;
import com.myhomelibrary.library_system.exceptions.InvalidCredentialsException;
import com.myhomelibrary.library_system.exceptions.TooManyAttemptsException;
import com.myhomelibrary.library_system.exceptions.UserAccountDisabledException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;

@Service
@RequiredArgsConstructor
public class FirebaseAuthService {

    private final HttpClient httpClient;
    private final ObjectMapper objectMapper;
    private final FirebaseProperties firebaseProperties;

    private String buildFirebaseUrl(String baseUrl) {
        return baseUrl + "?key=" + URLEncoder.encode(firebaseProperties.getWebApiKey(), StandardCharsets.UTF_8);
    }

    private <T> T sendFirebaseAuthRequest(String url, Object body, Class<T> responseType) {
        try {
            String requestJson = objectMapper.writeValueAsString(body);
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(requestJson))
                    .build();
            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() == 200) {
                return objectMapper.readValue(response.body(), responseType);
            } else {
                handleFirebaseAuthError(response.statusCode(), response.body());
            }
        } catch (IOException | InterruptedException | IllegalArgumentException e) {
            throw new AuthenticationException("Authentication service unavailable");
        }
        throw new AuthenticationException("Authentication failed");
    }

    public FirebaseSignInResponse signInWithEmailAndPassword(String email, String password) {
        String url = buildFirebaseUrl(firebaseProperties.getIdentityToolkitSignInWithPasswordUrl());
        FirebaseSignInRequest body = new FirebaseSignInRequest(email, password);
        return sendFirebaseAuthRequest(url, body, FirebaseSignInResponse.class);
    }

    public FirebaseSignInResponse signInWithCustomToken(String customToken) {
        String url = buildFirebaseUrl(firebaseProperties.getIdentityToolkitSignInWithCustomTokenUrl());
        var body = new java.util.HashMap<String, Object>();
        body.put("token", customToken);
        body.put("returnSecureToken", true);
        return sendFirebaseAuthRequest(url, body, FirebaseSignInResponse.class);
    }

    public FirebaseRefreshTokenResponse refreshToken(String refreshToken) {
        String url = buildFirebaseUrl(firebaseProperties.getIdentityToolkitRefreshTokenUrl());
        var body = new java.util.HashMap<String, Object>();
        body.put("grant_type", "refresh_token");
        body.put("refresh_token", refreshToken);
        return sendFirebaseAuthRequest(url, body, FirebaseRefreshTokenResponse.class);
    }

    private void handleFirebaseAuthError(int statusCode, String responseBody) {
        try {
            FirebaseErrorResponse errorResponse = objectMapper.readValue(responseBody, FirebaseErrorResponse.class);
            String message = errorResponse.error() != null ? errorResponse.error().message() : null;

            if (message != null) {
                handleFirebaseErrorMessage(message);
            }
        } catch (AuthenticationException ae) {
            throw ae;
        } catch (Exception parseException) {
            handleHttpStatusError(statusCode);
        }
    }

    private void handleFirebaseErrorMessage(String message) {
        switch (message) {
            case "EMAIL_NOT_FOUND":
                throw new InvalidCredentialsException("No account found with this email address. Please check your email or register for a new account.");
            case "INVALID_PASSWORD":
                throw new InvalidCredentialsException("The password you entered is incorrect. Please try again or reset your password.");
            case "INVALID_EMAIL":
                throw new InvalidCredentialsException("The email address format is invalid. Please enter a valid email address.");
            case "USER_DISABLED":
                throw new UserAccountDisabledException("Your account has been disabled by an administrator. Please contact support for assistance.");
            case "TOO_MANY_ATTEMPTS_TRY_LATER":
                throw new TooManyAttemptsException("Too many failed login attempts. Your account has been temporarily locked. Please try again later or reset your password.");
            case "INVALID_LOGIN_CREDENTIALS":
                throw new InvalidCredentialsException("Invalid login credentials. Please check your email and password and try again.");
            case "MISSING_PASSWORD":
                throw new InvalidCredentialsException("Password is required. Please enter your password.");
            case "MISSING_EMAIL":
                throw new InvalidCredentialsException("Email address is required. Please enter your email address.");
            default:
                throw new AuthenticationException("Authentication failed: " + message);
        }
    }

    private void handleHttpStatusError(int statusCode) {
        switch (statusCode) {
            case 400, 401:
                throw new AuthenticationException("Invalid email or password. Please check your input and try again.");
            case 403:
                throw new AuthenticationException("Access denied. You don't have permission to perform this action.");
            case 429:
                throw new TooManyAttemptsException("Too many requests. Please wait a moment before trying again.");
            case 500:
                throw new AuthenticationException("Authentication service is temporarily unavailable. Please try again later.");
            default:
                throw new AuthenticationException("Authentication failed due to an unexpected error. Please try again.");
        }
    }
}
