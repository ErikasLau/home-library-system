package com.myhomelibrary.library_system.converters;

import com.myhomelibrary.library_system.domains.enums.UserRole;
import com.myhomelibrary.library_system.domains.user.RegistrationRequest;
import com.myhomelibrary.library_system.domains.user.User;
import com.myhomelibrary.library_system.entities.UserEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserConverter {
    User toUser(UserEntity userEntity);

    UserEntity toUserEntity(User user);

    @Mapping(target = "role", source = "role")
    User toUser(RegistrationRequest registrationRequest, UserRole role);
}
