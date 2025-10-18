package com.myhomelibrary.library_system.services;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.UserRecord;
import com.myhomelibrary.library_system.converters.UserConverter;
import com.myhomelibrary.library_system.domains.enums.UserRole;
import com.myhomelibrary.library_system.domains.user.RegistrationRequest;
import com.myhomelibrary.library_system.domains.user.User;
import com.myhomelibrary.library_system.entities.UserEntity;
import com.myhomelibrary.library_system.exceptions.FirebaseServiceException;
import com.myhomelibrary.library_system.exceptions.ResourceAlreadyExistsException;
import com.myhomelibrary.library_system.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final FirebaseAuth firebaseAuth;
    private final UserRepository userRepository;
    private final UserConverter userConverter;

    public User registerUser(RegistrationRequest registrationRequest) {
        User user = userConverter.toUser(registrationRequest, UserRole.MEMBER);

        if (userRepository.findUserByEmail(user.getEmail()).isPresent()) {
            throw new ResourceAlreadyExistsException("User with this email already exists");
        }

        if (userRepository.findUserByUsername(user.getUsername()).isPresent()) {
            throw new ResourceAlreadyExistsException("User with this username already exists");
        }

        try {
            UserRecord userRecord = firebaseAuth.createUser(new UserRecord.CreateRequest()
                    .setEmail(user.getEmail())
                    .setPassword(registrationRequest.password())
                    .setDisplayName(user.getUsername()));

            user.setId(userRecord.getUid());
            UserEntity userEntity = userConverter.toUserEntity(user);
            userRepository.save(userEntity);

            return user;
        } catch (FirebaseAuthException e) {
            throw new FirebaseServiceException(e.getMessage(), e);
        }
    }

    //TODO
    public User getUserByToken(String token) {
        try {
            String uid = firebaseAuth.verifyIdToken(token).getUid();
            return userRepository.findUserById(uid)
                    .map(userConverter::toUser)
                    .orElse(null);
        } catch (FirebaseAuthException e) {
            throw new FirebaseServiceException("Firebase authentication error during token verification", e);
        }
    }
}
