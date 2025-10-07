package com.myhomelibrary.library_system.controllers;

import com.myhomelibrary.library_system.domains.api.Response;
import com.myhomelibrary.library_system.domains.comment.Comment;
import com.myhomelibrary.library_system.domains.comment.CommentRequest;
import com.myhomelibrary.library_system.domains.comment.CommentUpdateRequest;
import com.myhomelibrary.library_system.security.SecurityUtils;
import com.myhomelibrary.library_system.services.CommentService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

import static com.myhomelibrary.library_system.controllers.CommentController.COMMENT_BASE_URL;

@RestController
@RequestMapping(COMMENT_BASE_URL)
@AllArgsConstructor
public class CommentController {
    public static final String COMMENT_BASE_URL = "/v1/comment";

    private final CommentService commentService;

    // TODO: Maybe nest books under library? e.g. /v1/library/{libraryId}/books/{bookId}/comments
    @GetMapping
    public Response<List<Comment>> getCommentsByBookId(@Valid @RequestParam("bookId") @NotNull(message = "Book ID cannot be null") UUID bookId) {
        return Response.success(commentService.getAllCommentsByBookId(bookId));
    }

    @GetMapping("/{id}")
    public Response<Comment> getCommentById(@PathVariable UUID id) {
        return Response.success(commentService.getCommentById(id));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Response<Comment> createComment(@RequestBody CommentRequest commentRequest) {
        return Response.success(commentService.createComment(commentRequest, SecurityUtils.getAuthenticatedUserPk()));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public UUID deleteComment(@PathVariable UUID id) {
        return commentService.deleteCommentById(id);
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public Response<Comment> updateComment(@PathVariable UUID id, @RequestBody CommentUpdateRequest commentUpdateRequest) {
        return Response.success(commentService.updateComment(id, commentUpdateRequest));
    }
}
