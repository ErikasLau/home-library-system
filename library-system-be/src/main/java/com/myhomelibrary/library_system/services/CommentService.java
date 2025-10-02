package com.myhomelibrary.library_system.services;

import com.myhomelibrary.library_system.converters.CommentConverter;
import com.myhomelibrary.library_system.domains.comment.Comment;
import com.myhomelibrary.library_system.domains.comment.CommentRequest;
import com.myhomelibrary.library_system.domains.comment.CommentUpdateRequest;
import com.myhomelibrary.library_system.exceptions.NotFoundException;
import com.myhomelibrary.library_system.repositories.BookRepository;
import com.myhomelibrary.library_system.repositories.CommentRepository;
import com.myhomelibrary.library_system.repositories.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@AllArgsConstructor
@Transactional
public class CommentService {
    private final BookRepository bookRepository;
    private final CommentRepository commentRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public Comment getCommentById(UUID id) {
        return CommentConverter.toComment(commentRepository.findCommentById(id).orElseThrow(NotFoundException::new));
    }

    @Transactional(readOnly = true)
    public List<Comment> getAllCommentsByBookId(UUID bookId) {
        var bookEntity = bookRepository.findBookById(bookId).orElseThrow(NotFoundException::new);
        return commentRepository.findAllByBookId(bookEntity.getPk()).stream().map(CommentConverter::toComment).toList();
    }

    @Transactional
    public UUID deleteCommentById(UUID id) {
        var comment = commentRepository.findCommentById(id).orElseThrow(NotFoundException::new);
        commentRepository.deleteById(comment.getPk());
        return comment.getId();
    }

    @Transactional
    public Comment createComment(CommentRequest commentRequest, Long userId) {
        var bookEntity = bookRepository.findBookById(commentRequest.getBookId()).orElseThrow(NotFoundException::new);
        var userEntity = userRepository.findById(userId).orElseThrow(NotFoundException::new);

        var commentEntity = CommentConverter.toCommentEntity(commentRequest, bookEntity.getPk(), userId);
        commentEntity.setUser(userEntity);

        var savedCommentEntity = commentRepository.saveAndFlush(commentEntity);

        return CommentConverter.toComment(savedCommentEntity);
    }

    @Transactional
    public Comment updateComment(UUID id, CommentUpdateRequest commentUpdateRequest) {
        var commentEntity = commentRepository.findCommentById(id).orElseThrow(NotFoundException::new);

        commentEntity.setText(commentUpdateRequest.getText());
        commentEntity.setRating(commentUpdateRequest.getRating());

        var savedCommentEntity = commentRepository.save(commentEntity);
        return CommentConverter.toComment(savedCommentEntity);
    }
}
