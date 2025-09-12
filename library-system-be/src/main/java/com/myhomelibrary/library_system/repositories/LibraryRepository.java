package com.myhomelibrary.library_system.repositories;

import com.myhomelibrary.library_system.entities.Library;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface LibraryRepository extends JpaRepository<Library, Long> {
    Optional<Library> findLibraryById(UUID id);
}
