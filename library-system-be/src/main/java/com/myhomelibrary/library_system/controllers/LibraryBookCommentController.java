package com.myhomelibrary.library_system.controllers;

import com.myhomelibrary.library_system.domains.api.Response;
import com.myhomelibrary.library_system.domains.comment.Comment;
import com.myhomelibrary.library_system.domains.comment.CommentRequest;
import com.myhomelibrary.library_system.domains.comment.CommentUpdateRequest;
import com.myhomelibrary.library_system.repositories.CommentRepository;
import com.myhomelibrary.library_system.repositories.LibraryRepository;
import com.myhomelibrary.library_system.security.SecurityUtils;
import com.myhomelibrary.library_system.services.CommentService;
import com.myhomelibrary.library_system.services.GenericAccessService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

import static com.myhomelibrary.library_system.controllers.LibraryController.LIBRARY_BASE_URL;

@RestController
@RequestMapping(LIBRARY_BASE_URL + "/{libraryId}/books/{bookId}/comments")
@AllArgsConstructor
public class LibraryBookCommentController {
    private final CommentService commentService;
    private final CommentRepository commentRepository;
    private final LibraryRepository libraryRepository;
    private final GenericAccessService genericAccessService;

    @GetMapping
    public Response<List<Comment>> getComments(@PathVariable UUID libraryId, @PathVariable UUID bookId) {
        return Response.success(commentService.getAllCommentsByLibraryAndBookId(libraryId, bookId));
    }

    @GetMapping("/{id}")
    public Response<Comment> getCommentById(@PathVariable UUID libraryId, @PathVariable UUID bookId, @PathVariable UUID id) {
        genericAccessService.assertOwnerOrAdmin(libraryRepository::findLibraryById, libraryId);
        return Response.success(commentService.getCommentByIdInLibraryBook(libraryId, bookId, id));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Response<Comment> createComment(@PathVariable UUID libraryId, @PathVariable UUID bookId, @RequestBody CommentRequest commentRequest) {
        genericAccessService.assertOwnerOrAdmin(libraryRepository::findLibraryById, libraryId);
        return Response.success(commentService.createCommentInLibraryBook(libraryId, bookId, commentRequest, SecurityUtils.getAuthenticatedUserPk()));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public UUID deleteComment(@PathVariable UUID libraryId, @PathVariable UUID bookId, @PathVariable UUID id) {
        genericAccessService.assertOwnerOrAdmin(commentRepository::findCommentById, id);
        return commentService.deleteCommentByIdInLibraryBook(libraryId, bookId, id);
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public Response<Comment> updateComment(@PathVariable UUID libraryId, @PathVariable UUID bookId, @PathVariable UUID id, @RequestBody CommentUpdateRequest commentUpdateRequest) {
        genericAccessService.assertOwnerOrAdmin(commentRepository::findCommentById, id);
        return Response.success(commentService.updateCommentInLibraryBook(libraryId, bookId, id, commentUpdateRequest));
    }
}
