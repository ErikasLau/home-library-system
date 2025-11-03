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
    private final CommentConverter commentConverter;

    @Transactional(readOnly = true)
    public List<Comment> getAllCommentsByLibraryAndBookId(UUID libraryId, UUID bookId) {
        var bookEntity = bookRepository.findBookByIdAndLibrary_Id(bookId, libraryId).orElseThrow(NotFoundException::new);
        return commentRepository.findAllByBookId(bookEntity.getPk()).stream()
                .map(commentConverter::toComment)
                .sorted((c1, c2) -> {
                    int result = c2.updatedAt().compareTo(c1.updatedAt());
                    return result != 0 ? result : c2.createdAt().compareTo(c1.createdAt());
                })
                .toList();
    }

    @Transactional(readOnly = true)
    public Comment getCommentByIdInLibraryBook(UUID libraryId, UUID bookId, UUID commentId) {
        var bookEntity = bookRepository.findBookByIdAndLibrary_Id(bookId, libraryId).orElseThrow(NotFoundException::new);
        var commentEntity = commentRepository.findCommentById(commentId).orElseThrow(NotFoundException::new);
        if (!commentEntity.getBook().getPk().equals(bookEntity.getPk())) throw new NotFoundException();
        return commentConverter.toComment(commentEntity);
    }

    @Transactional
    public Comment createCommentInLibraryBook(UUID libraryId, UUID bookId, CommentRequest commentRequest, Long userId) {
        var bookEntity = bookRepository.findBookByIdAndLibrary_Id(bookId, libraryId).orElseThrow(NotFoundException::new);
        var userEntity = userRepository.findById(userId).orElseThrow(NotFoundException::new);
        var commentEntity = commentConverter.toCommentEntity(commentRequest, bookEntity.getPk(), userId);
        commentEntity.setUser(userEntity);
        var savedCommentEntity = commentRepository.saveAndFlush(commentEntity);
        return commentConverter.toComment(savedCommentEntity);
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
        commentConverter.updateCommentEntity(commentUpdateRequest, commentEntity);
        var savedCommentEntity = commentRepository.save(commentEntity);
        return commentConverter.toComment(savedCommentEntity);
    }
}
