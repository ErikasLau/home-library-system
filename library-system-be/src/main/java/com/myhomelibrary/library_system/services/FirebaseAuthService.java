package com.myhomelibrary.library_system.services;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.myhomelibrary.library_system.configs.FirebaseProperties;
import com.myhomelibrary.library_system.domains.firebase.FirebaseErrorResponse;
import com.myhomelibrary.library_system.domains.firebase.FirebaseSignInRequest;
import com.myhomelibrary.library_system.domains.firebase.FirebaseSignInResponse;
import com.myhomelibrary.library_system.exceptions.AuthenticationException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;

@Slf4j
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
            log.error("Firebase authentication service unavailable: {}", e.getMessage());
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

    private void handleFirebaseAuthError(int statusCode, String responseBody) {
        try {
            FirebaseErrorResponse errorResponse = objectMapper.readValue(responseBody, FirebaseErrorResponse.class);
            String message = errorResponse.error() != null ? errorResponse.error().message() : null;

            if (message != null) {
                switch (message) {
                    case "EMAIL_NOT_FOUND":
                        throw new AuthenticationException("No user found with this email address");
                    case "INVALID_PASSWORD":
                        throw new AuthenticationException("Invalid password");
                    case "USER_DISABLED":
                        throw new AuthenticationException("User account has been disabled");
                    case "TOO_MANY_ATTEMPTS_TRY_LATER":
                        throw new AuthenticationException("Too many failed attempts. Please try again later");
                    default:
                        throw new AuthenticationException("Authentication failed: " + message);
                }
            }
        } catch (AuthenticationException ae) {
            throw ae;
        } catch (Exception parseException) {
            log.warn("Failed to parse Firebase error response for status {}: {}", statusCode, parseException.getMessage());
        }

        throw new AuthenticationException("Authentication failed");
    }
}
