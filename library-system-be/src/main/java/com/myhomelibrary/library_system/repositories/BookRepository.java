package com.myhomelibrary.library_system.repositories;

import com.myhomelibrary.library_system.entities.BookEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface BookRepository extends JpaRepository<BookEntity, Long> {
    Optional<BookEntity> findBookById(UUID id);

    Optional<BookEntity> findBookByIdAndLibrary_Id(UUID id, UUID libraryId);

    Page<BookEntity> findAllBooksByLibrary_Id(UUID libraryId, Pageable pageable);
}
