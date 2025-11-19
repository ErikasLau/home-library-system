package com.myhomelibrary.library_system.repositories;

import com.myhomelibrary.library_system.entities.CommentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CommentRepository extends JpaRepository<CommentEntity, Long> {
    Optional<CommentEntity> findCommentById(UUID id);

    @Query("SELECT c FROM CommentEntity c WHERE c.bookId = :bookId ORDER BY c.updatedAt DESC, c.createdAt DESC")
    List<CommentEntity> findAllByBookId(@Param("bookId") Long bookId);
}
