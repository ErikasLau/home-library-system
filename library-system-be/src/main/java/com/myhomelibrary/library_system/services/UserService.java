package com.myhomelibrary.library_system.services;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import com.google.firebase.auth.UserRecord;
import com.myhomelibrary.library_system.converters.UserConverter;
import com.myhomelibrary.library_system.domains.enums.UserRole;
import com.myhomelibrary.library_system.domains.firebase.FirebaseSignInResponse;
import com.myhomelibrary.library_system.domains.firebase.UserCustomClaims;
import com.myhomelibrary.library_system.domains.user.RegistrationRequest;
import com.myhomelibrary.library_system.domains.user.User;
import com.myhomelibrary.library_system.exceptions.FirebaseServiceException;
import com.myhomelibrary.library_system.exceptions.ResourceAlreadyExistsException;
import com.myhomelibrary.library_system.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
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
            log.error("Firebase user creation failed: {}", e.getMessage(), e);
            throw new FirebaseServiceException(e.getMessage(), e);
        }
    }

    private void validateUserUniqueness(final String email, final String username) {
        userRepository.findUserByEmail(email).ifPresent(u -> {
            throw new ResourceAlreadyExistsException("User with this email already exists");
        });
        userRepository.findUserByUsername(username).ifPresent(u -> {
            throw new ResourceAlreadyExistsException("User with this username already exists");
        });
    }

    public String authenticateWithEmailAndPassword(final String email, final String password) {
        FirebaseSignInResponse signInResponse = firebaseAuthService.signInWithEmailAndPassword(email, password);
        try {
            FirebaseToken decodedToken = firebaseAuth.verifyIdToken(signInResponse.idToken());
            String firebaseUid = decodedToken.getUid();
            User user = userRepository.findUserById(firebaseUid)
                    .map(userConverter::toUser)
                    .orElseThrow(() -> {
                        log.error("User retrieval failed for UID: {}", firebaseUid);
                        return new FirebaseServiceException("There was an error during user retrieval");
                    });
            return createFirebaseCustomClaims(user);
        } catch (FirebaseAuthException e) {
            log.error("Token verification failed: {}", e.getMessage(), e);
            throw new FirebaseServiceException("Token verification failed", e);
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
            log.error("Failed to set custom claims: {}", e.getMessage(), e);
            throw new FirebaseServiceException("Failed to set custom claims", e);
        }
    }

}
