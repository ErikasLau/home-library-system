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
    public List<Comment> getAllCommentsByLibraryAndBookId(UUID libraryId, UUID bookId) {
        var bookEntity = bookRepository.findBookByIdAndLibrary_Id(bookId, libraryId).orElseThrow(NotFoundException::new);
        return commentRepository.findAllByBookId(bookEntity.getPk()).stream().map(CommentConverter::toComment).toList();
    }

    @Transactional(readOnly = true)
    public Comment getCommentByIdInLibraryBook(UUID libraryId, UUID bookId, UUID commentId) {
        var bookEntity = bookRepository.findBookByIdAndLibrary_Id(bookId, libraryId).orElseThrow(NotFoundException::new);
        var commentEntity = commentRepository.findCommentById(commentId).orElseThrow(NotFoundException::new);
        if (!commentEntity.getBook().getPk().equals(bookEntity.getPk())) throw new NotFoundException();
        return CommentConverter.toComment(commentEntity);
    }

    @Transactional
    public Comment createCommentInLibraryBook(UUID libraryId, UUID bookId, CommentRequest commentRequest, Long userId) {
        var bookEntity = bookRepository.findBookByIdAndLibrary_Id(bookId, libraryId).orElseThrow(NotFoundException::new);
        var userEntity = userRepository.findById(userId).orElseThrow(NotFoundException::new);
        var commentEntity = CommentConverter.toCommentEntity(commentRequest, bookEntity.getPk(), userId);
        commentEntity.setUser(userEntity);
        var savedCommentEntity = commentRepository.saveAndFlush(commentEntity);
        return CommentConverter.toComment(savedCommentEntity);
    }

    @Transactional
    public UUID deleteCommentByIdInLibraryBook(UUID libraryId, UUID bookId, UUID commentId) {
        var bookEntity = bookRepository.findBookByIdAndLibrary_Id(bookId, libraryId).orElseThrow(NotFoundException::new);
        var commentEntity = commentRepository.findCommentById(commentId).orElseThrow(NotFoundException::new);
        if (!commentEntity.getBook().getPk().equals(bookEntity.getPk())) throw new NotFoundException();
        commentRepository.deleteById(commentEntity.getPk());
        return commentEntity.getId();
    }

    @Transactional
    public Comment updateCommentInLibraryBook(UUID libraryId, UUID bookId, UUID commentId, CommentUpdateRequest commentUpdateRequest) {
        var bookEntity = bookRepository.findBookByIdAndLibrary_Id(bookId, libraryId).orElseThrow(NotFoundException::new);
        var commentEntity = commentRepository.findCommentById(commentId).orElseThrow(NotFoundException::new);
        if (!commentEntity.getBook().getPk().equals(bookEntity.getPk())) throw new NotFoundException();
        commentEntity.setText(commentUpdateRequest.getText());
        commentEntity.setRating(commentUpdateRequest.getRating());
        var savedCommentEntity = commentRepository.save(commentEntity);
        return CommentConverter.toComment(savedCommentEntity);
    }
}
