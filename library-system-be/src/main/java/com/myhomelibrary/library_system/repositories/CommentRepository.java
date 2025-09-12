package com.myhomelibrary.library_system.repositories;

import com.myhomelibrary.library_system.entities.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    Optional<Comment> findCommentById(UUID id);
}
