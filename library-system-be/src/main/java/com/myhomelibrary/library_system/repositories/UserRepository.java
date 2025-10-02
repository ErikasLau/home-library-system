package com.myhomelibrary.library_system.repositories;

import com.myhomelibrary.library_system.entities.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, Long> {
    Optional<UserEntity> findUserById(String id);

    Optional<UserEntity> findUserByEmail(String email);
}