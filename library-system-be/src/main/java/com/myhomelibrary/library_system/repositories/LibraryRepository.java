package com.myhomelibrary.library_system.repositories;

import com.myhomelibrary.library_system.entities.Library;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface LibraryRepository extends JpaRepository<Library, Long> {
    Optional<Library> findLibraryById(UUID id);
}
