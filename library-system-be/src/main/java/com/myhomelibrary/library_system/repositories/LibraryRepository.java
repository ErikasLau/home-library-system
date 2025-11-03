package com.myhomelibrary.library_system.repositories;

import com.myhomelibrary.library_system.entities.LibraryEntity;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface LibraryRepository extends JpaRepository<LibraryEntity, Long> {
    @EntityGraph(attributePaths = {"owner"})
    Optional<LibraryEntity> findLibraryById(UUID id);

    @EntityGraph(attributePaths = {"owner"})
    List<LibraryEntity> findAllByUserId(Long userId);

    @EntityGraph(attributePaths = {"owner"})
    @Override
    List<LibraryEntity> findAll();
}
