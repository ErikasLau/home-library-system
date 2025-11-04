package com.myhomelibrary.library_system.services;

import com.google.firebase.auth.FirebaseAuthException;
import com.myhomelibrary.library_system.exceptions.ResourceAlreadyExistsException;
import com.myhomelibrary.library_system.exceptions.TokenValidationException;
import com.myhomelibrary.library_system.exceptions.UserRegistrationException;

public class FirebaseErrorHandler {
    public static void handleRegistrationError(FirebaseAuthException e) {
        if (e.getAuthErrorCode() != null) {
            switch (e.getAuthErrorCode().name()) {
                case "EMAIL_ALREADY_EXISTS":
                    throw new ResourceAlreadyExistsException("An account with this email address already exists. Please try logging in or use a different email address.");
                case "WEAK_PASSWORD":
                    throw new UserRegistrationException("Password is too weak. Please choose a password with at least 6 characters, including letters and numbers.");
                case "INVALID_EMAIL":
                    throw new UserRegistrationException("The email address format is invalid. Please enter a valid email address.");
                case "OPERATION_NOT_ALLOWED":
                    throw new UserRegistrationException("User registration is currently disabled. Please contact support for assistance.");
                case "TOO_MANY_REQUESTS":
                    throw new UserRegistrationException("Too many registration attempts. Please wait a moment before trying again.");
                default:
                    throw new UserRegistrationException("Registration failed due to an authentication service error: " + e.getMessage());
            }
        }
        throw new UserRegistrationException("User registration failed. Please try again or contact support if the problem persists.");
    }

    public static void handleTokenError(FirebaseAuthException e) {
        if (e.getAuthErrorCode() != null) {
            switch (e.getAuthErrorCode().name()) {
                case "EXPIRED_ID_TOKEN":
                    throw new TokenValidationException("Your login session has expired. Please log in again.");
                case "INVALID_ID_TOKEN":
                    throw new TokenValidationException("Invalid authentication token. Please log in again.");
                case "REVOKED_ID_TOKEN":
                    throw new TokenValidationException("Your authentication token has been revoked. Please log in again.");
                case "INSUFFICIENT_PERMISSION":
                    throw new TokenValidationException("Insufficient permissions to create authentication token. Please contact support.");
                case "INVALID_UID":
                    throw new TokenValidationException("Invalid user identifier. Please contact support to resolve this issue.");
                case "TOO_MANY_REQUESTS":
                    throw new TokenValidationException("Too many authentication requests. Please wait a moment before trying again.");
                default:
                    throw new TokenValidationException("Authentication token verification failed. Please try logging in again.");
            }
        }
        throw new TokenValidationException("Token validation failed. Please try again.");
    }
}
