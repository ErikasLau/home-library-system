package com.myhomelibrary.library_system.controllers;

import com.myhomelibrary.library_system.domains.Comment.Comment;
import com.myhomelibrary.library_system.domains.Comment.CommentRequest;
import com.myhomelibrary.library_system.domains.Comment.CommentUpdateRequest;
import com.myhomelibrary.library_system.services.CommentService;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
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

    @GetMapping
    @Validated
    public List<Comment> getCommentsByBookId(@RequestParam("bookId") @NotNull(message = "Book ID cannot be null") UUID bookId) {
        return commentService.getAllCommentsByBookId(bookId);
    }

    @GetMapping("/{id}")
    public Comment getCommentById(@PathVariable UUID id) {
        return commentService.getCommentById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Comment createComment(@RequestBody CommentRequest commentRequest) {
        var user = 1L;
        return commentService.createComment(commentRequest, user);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public UUID deleteComment(@PathVariable UUID id) {
        return commentService.deleteCommentById(id);
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public Comment updateComment(@PathVariable UUID id, @RequestBody CommentUpdateRequest commentUpdateRequest) {
        return commentService.updateComment(id, commentUpdateRequest);
    }
}
