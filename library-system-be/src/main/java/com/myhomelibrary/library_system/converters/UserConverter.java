package com.myhomelibrary.library_system.converters;

import com.myhomelibrary.library_system.domains.User.RegistrationRequest;
import com.myhomelibrary.library_system.domains.User.User;
import com.myhomelibrary.library_system.domains.enums.UserRole;
import com.myhomelibrary.library_system.entities.UserEntity;

public class UserConverter {
    public static User toUser(UserEntity userEntity) {
        return User.builder()
                .id(userEntity.getId())
                .name(userEntity.getName())
                .surname(userEntity.getSurname())
                .username(userEntity.getUsername())
                .email(userEntity.getEmail())
                .dateOfBirth(userEntity.getDateOfBirth())
                .role(userEntity.getRole())
                .build();
    }

    public static UserEntity toUserEntity(User user) {
        return UserEntity.builder()
                .id(user.getId())
                .name(user.getName())
                .surname(user.getSurname())
                .username(user.getUsername())
                .email(user.getEmail())
                .dateOfBirth(user.getDateOfBirth())
                .role(user.getRole())
                .build();
    }

    public static User toUser(RegistrationRequest registrationRequest, UserRole role) {
        return User.builder()
                .email(registrationRequest.email())
                .username(registrationRequest.username())
                .name(registrationRequest.name())
                .surname(registrationRequest.surname())
                .dateOfBirth(registrationRequest.dateOfBirth())
                .role(role)
                .build();
    }
}
