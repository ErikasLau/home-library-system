package com.myhomelibrary.library_system.repositories;

import com.myhomelibrary.library_system.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findUserById(UUID id);
}