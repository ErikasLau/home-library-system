package com.myhomelibrary.library_system.services;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.UserRecord;
import com.myhomelibrary.library_system.converters.UserConverter;
import com.myhomelibrary.library_system.domains.enums.UserRole;
import com.myhomelibrary.library_system.domains.user.RegistrationRequest;
import com.myhomelibrary.library_system.domains.user.User;
import com.myhomelibrary.library_system.entities.UserEntity;
import com.myhomelibrary.library_system.exceptions.NotFoundException;
import com.myhomelibrary.library_system.exceptions.ResourceAlreadyExistsException;
import com.myhomelibrary.library_system.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import static com.myhomelibrary.library_system.converters.UserConverter.toUser;

@Service
@RequiredArgsConstructor
public class UserService {

    private final FirebaseAuth firebaseAuth;
    private final UserRepository userRepository;

    public User registerUser(RegistrationRequest registrationRequest) {
        User user = toUser(registrationRequest, UserRole.MEMBER);

        if (userRepository.findUserByEmail(user.getEmail()).isPresent()) {
            throw new ResourceAlreadyExistsException("User with this email already exists");
        }

        try {
            UserRecord.CreateRequest request = new UserRecord.CreateRequest()
                    .setEmail(user.getEmail())
                    .setPassword(registrationRequest.password())
                    .setDisplayName(user.getUsername());

            UserRecord userRecord = firebaseAuth.createUser(request);

            user.setId(userRecord.getUid());
            UserEntity userEntity = UserConverter.toUserEntity(user);
            userRepository.save(userEntity);

            return user;
        } catch (FirebaseAuthException e) {
            throw new RuntimeException(e);
        }
    }

    //TODO
    public User getUserByToken(String token) {
        try {
            String uid = firebaseAuth.verifyIdToken(token).getUid();
            return userRepository.findUserById(uid)
                    .map(UserConverter::toUser)
                    .orElse(null);
        } catch (FirebaseAuthException e) {
            throw new RuntimeException(e);
        }
    }
}
