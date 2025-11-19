package com.myhomelibrary.library_system.repositories;

import com.myhomelibrary.library_system.domains.enums.LibraryPrivacyStatus;
import com.myhomelibrary.library_system.entities.LibraryEntity;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface LibraryRepository extends JpaRepository<LibraryEntity, Long> {
    @EntityGraph(attributePaths = {"owner"})
    Optional<LibraryEntity> findLibraryById(UUID id);

    @EntityGraph(attributePaths = {"owner"})
    @Query("SELECT l FROM LibraryEntity l WHERE l.userId = :userId ORDER BY l.updatedAt DESC, l.createdAt DESC")
    List<LibraryEntity> findAllByUserId(@Param("userId") Long userId);

    @EntityGraph(attributePaths = {"owner"})
    @Query("SELECT l FROM LibraryEntity l WHERE l.userId != :excludeUserId ORDER BY l.updatedAt DESC, l.createdAt DESC")
    List<LibraryEntity> findAllExcludingUser(@Param("excludeUserId") Long excludeUserId);

    @EntityGraph(attributePaths = {"owner"})
    @Query("SELECT l FROM LibraryEntity l WHERE l.privacyStatus = :privacyStatus AND l.userId != :excludeUserId ORDER BY l.updatedAt DESC, l.createdAt DESC")
    List<LibraryEntity> findAllByPrivacyStatusExcludingUser(@Param("privacyStatus") LibraryPrivacyStatus privacyStatus, @Param("excludeUserId") Long excludeUserId);

    @EntityGraph(attributePaths = {"owner"})
    @Override
    List<LibraryEntity> findAll();

    @EntityGraph(attributePaths = {"owner"})
    List<LibraryEntity> findAllByPrivacyStatus(LibraryPrivacyStatus privacyStatus);
}
