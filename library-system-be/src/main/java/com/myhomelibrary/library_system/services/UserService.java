package com.myhomelibrary.library_system.services;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import com.google.firebase.auth.UserRecord;
import com.myhomelibrary.library_system.converters.UserConverter;
import com.myhomelibrary.library_system.domains.enums.UserRole;
import com.myhomelibrary.library_system.domains.firebase.FirebaseRefreshTokenResponse;
import com.myhomelibrary.library_system.domains.firebase.FirebaseSignInResponse;
import com.myhomelibrary.library_system.domains.firebase.UserCustomClaims;
import com.myhomelibrary.library_system.domains.user.LoginResponse;
import com.myhomelibrary.library_system.domains.user.RefreshTokenResponse;
import com.myhomelibrary.library_system.domains.user.RegistrationRequest;
import com.myhomelibrary.library_system.domains.user.User;
import com.myhomelibrary.library_system.exceptions.ResourceAlreadyExistsException;
import com.myhomelibrary.library_system.exceptions.TokenValidationException;
import com.myhomelibrary.library_system.exceptions.UserRegistrationException;
import com.myhomelibrary.library_system.repositories.UserRepository;
import com.myhomelibrary.library_system.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final FirebaseAuth firebaseAuth;
    private final UserRepository userRepository;
    private final UserConverter userConverter;
    private final FirebaseAuthService firebaseAuthService;

    public User registerUser(final RegistrationRequest registrationRequest) {
        User user = userConverter.toUser(registrationRequest, UserRole.MEMBER);
        validateUserUniqueness(user.getEmail(), user.getUsername());

        try {
            UserRecord userRecord = firebaseAuth.createUser(new UserRecord.CreateRequest()
                    .setEmail(user.getEmail())
                    .setPassword(registrationRequest.password())
                    .setDisplayName(user.getUsername()));
            user.setId(userRecord.getUid());
            userRepository.save(userConverter.toUserEntity(user));
            return user;
        } catch (FirebaseAuthException e) {
            FirebaseErrorHandler.handleRegistrationError(e);
            return null;
        } catch (Exception e) {
            throw new UserRegistrationException("An unexpected error occurred during registration. Please try again later.");
        }
    }

    private void validateUserUniqueness(final String email, final String username) {
        userRepository.findUserByEmail(email).ifPresent(u -> {
            throw new ResourceAlreadyExistsException("An account with this email address already exists. Please try logging in or use a different email address.");
        });
        userRepository.findUserByUsername(username).ifPresent(u -> {
            throw new ResourceAlreadyExistsException("This username is already taken. Please choose a different username.");
        });
    }

    public LoginResponse authenticateWithEmailAndPassword(final String email, final String password) {
        FirebaseSignInResponse signInResponse = firebaseAuthService.signInWithEmailAndPassword(email, password);

        try {
            FirebaseToken decodedToken = firebaseAuth.verifyIdToken(signInResponse.idToken());
            String firebaseUid = decodedToken.getUid();

            User user = userRepository.findUserById(firebaseUid)
                    .map(userConverter::toUser)
                    .orElseThrow(() -> new TokenValidationException("User profile not found. Please contact support to resolve this issue."));

            String token = createFirebaseCustomClaims(user);
            return new LoginResponse(token, signInResponse.refreshToken(), signInResponse.expiresIn(), user);

        } catch (FirebaseAuthException e) {
            FirebaseErrorHandler.handleTokenError(e);
            return null;
        } catch (TokenValidationException te) {
            throw te;
        } catch (Exception e) {
            throw new TokenValidationException("An unexpected error occurred during authentication. Please try again.");
        }
    }

    private String createFirebaseCustomClaims(final User user) {
        try {
            UserCustomClaims customClaims = new UserCustomClaims(
                    user.getPk(),
                    user.getId(),
                    user.getUsername(),
                    user.getName(),
                    user.getSurname(),
                    user.getRole().name(),
                    user.getDateOfBirth() != null ? user.getDateOfBirth().toString() : null
            );

            return firebaseAuth.createCustomToken(user.getId(), customClaims.toMap());
        } catch (FirebaseAuthException e) {
            FirebaseErrorHandler.handleTokenError(e);
            return null;
        } catch (Exception e) {
            throw new TokenValidationException("An unexpected error occurred while generating your authentication token. Please try again.");
        }
    }

    public User getCurrentUser() {
        try {
            String firebaseUid = SecurityUtils.getAuthenticatedUser().firebaseUid();

            if (firebaseUid == null || firebaseUid.trim().isEmpty()) {
                throw new TokenValidationException("Authentication session is invalid. Please log in again.");
            }

            return userRepository.findUserById(firebaseUid)
                    .map(userConverter::toUser)
                    .orElseThrow(() -> new TokenValidationException("User profile not found. Your account may have been deleted or there's a synchronization issue. Please contact support."));
        } catch (TokenValidationException te) {
            throw te;
        } catch (Exception e) {
            throw new TokenValidationException("An unexpected error occurred while retrieving your user profile. Please try again or contact support.");
        }
    }

    public RefreshTokenResponse refreshAccessToken(final String refreshToken) {
        if (refreshToken == null || refreshToken.trim().isEmpty()) {
            throw new TokenValidationException("Refresh token is required.");
        }

        try {
            FirebaseRefreshTokenResponse firebaseResponse = firebaseAuthService.refreshToken(refreshToken);

            FirebaseToken decodedToken = firebaseAuth.verifyIdToken(firebaseResponse.idToken());
            String firebaseUid = decodedToken.getUid();

            User user = userRepository.findUserById(firebaseUid)
                    .map(userConverter::toUser)
                    .orElseThrow(() -> new TokenValidationException("User profile not found. Please contact support to resolve this issue."));

            String customToken = createFirebaseCustomClaims(user);

            return new RefreshTokenResponse(
                    customToken,
                    firebaseResponse.refreshToken(),
                    firebaseResponse.expiresIn()
            );

        } catch (FirebaseAuthException e) {
            FirebaseErrorHandler.handleTokenError(e);
            return null;
        } catch (TokenValidationException te) {
            throw te;
        } catch (Exception e) {
            throw new TokenValidationException("An unexpected error occurred while refreshing your token. Please log in again.");
        }
    }

}
