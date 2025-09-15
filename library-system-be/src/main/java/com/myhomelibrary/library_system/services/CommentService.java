package com.myhomelibrary.library_system.services;

import com.myhomelibrary.library_system.converters.CommentConverter;
import com.myhomelibrary.library_system.domains.Comment.Comment;
import com.myhomelibrary.library_system.domains.Comment.CommentRequest;
import com.myhomelibrary.library_system.exceptions.NotFoundException;
import com.myhomelibrary.library_system.repositories.BookRepository;
import com.myhomelibrary.library_system.repositories.CommentRepository;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@AllArgsConstructor
@Transactional
public class CommentService {
    private final BookRepository bookRepository;
    private final CommentRepository commentRepository;

    @Transactional(readOnly = true)
    public Comment getCommentById(UUID id) {
        return CommentConverter.toComment(commentRepository.findCommentById(id).orElseThrow(NotFoundException::new));
    }

    @Transactional(readOnly = true)
    public Page<Comment> getAllComment(int pageNumber, int pageSize, Sort sort) {
        Pageable pageable = PageRequest.of(pageNumber, pageSize, sort);
        return commentRepository.findAll(pageable)
                .map(CommentConverter::toComment);
    }

    @Transactional
    public UUID deleteCommentById(UUID id) {
        var comment = commentRepository.findCommentById(id).orElseThrow(NotFoundException::new);
        commentRepository.deleteById(comment.getPk());
        return comment.getId();
    }

    @Transactional
    public Comment createComment(CommentRequest commentRequest, UUID bookId, Long userId) {
        var bookEntity = bookRepository.findBookById(bookId).orElseThrow(NotFoundException::new);
        var commentEntity = CommentConverter.toCommentEntity(commentRequest, bookEntity.getPk(), userId);
        var savedCommentEntity = commentRepository.save(commentEntity);
        return CommentConverter.toComment(savedCommentEntity);
    }

    @Transactional
    public Comment updateComment(UUID id, CommentRequest commentRequest) {
        var commentEntity = commentRepository.findCommentById(id).orElseThrow(NotFoundException::new);

        commentEntity.setText(commentRequest.getText());
        commentEntity.setRating(commentRequest.getRating());

        var savedCommentEntity = commentRepository.save(commentEntity);
        return CommentConverter.toComment(savedCommentEntity);
    }
}
