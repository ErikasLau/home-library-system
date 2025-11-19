package com.myhomelibrary.library_system.repositories;

import com.myhomelibrary.library_system.entities.BookEntity;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface BookRepository extends JpaRepository<BookEntity, Long> {
    @EntityGraph(attributePaths = {"user"})
    Optional<BookEntity> findBookById(UUID id);

    @EntityGraph(attributePaths = {"user", "comments", "comments.user"})
    Optional<BookEntity> findBookByIdAndLibrary_Id(UUID id, UUID libraryId);

    @EntityGraph(attributePaths = {"user"})
    @Query("SELECT b FROM BookEntity b WHERE b.library.id = :libraryId ORDER BY b.updatedAt DESC, b.createdAt DESC")
    List<BookEntity> findAllBooksByLibrary_Id(@Param("libraryId") UUID libraryId);
}
