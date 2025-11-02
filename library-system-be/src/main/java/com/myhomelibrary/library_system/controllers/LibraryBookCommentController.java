package com.myhomelibrary.library_system.controllers;

import com.myhomelibrary.library_system.domains.api.Response;
import com.myhomelibrary.library_system.domains.comment.Comment;
import com.myhomelibrary.library_system.domains.comment.CommentRequest;
import com.myhomelibrary.library_system.domains.comment.CommentUpdateRequest;
import com.myhomelibrary.library_system.exceptions.NotFoundException;
import com.myhomelibrary.library_system.repositories.CommentRepository;
import com.myhomelibrary.library_system.repositories.LibraryRepository;
import com.myhomelibrary.library_system.security.SecurityUtils;
import com.myhomelibrary.library_system.services.CommentService;
import com.myhomelibrary.library_system.services.GenericAccessService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

import static com.myhomelibrary.library_system.controllers.LibraryController.LIBRARY_BASE_URL;

@RestController
@RequestMapping(LIBRARY_BASE_URL + "/{libraryId}/books/{bookId}/comments")
@AllArgsConstructor
@Tag(name = "Book Comments", description = "Operations related to comments on books in a library")
public class LibraryBookCommentController {
    private final CommentService commentService;
    private final CommentRepository commentRepository;
    private final LibraryRepository libraryRepository;
    private final GenericAccessService genericAccessService;

    @GetMapping
    @Operation(summary = "Get comments for book", description = "Returns all comments for a specific book in a library.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Comments retrieved successfully"),
    })
    public Response<List<Comment>> getComments(@PathVariable String libraryId, @PathVariable String bookId) {
        UUID libUuid = parseUuid(libraryId);
        UUID bookUuid = parseUuid(bookId);
        return Response.success(commentService.getAllCommentsByLibraryAndBookId(libUuid, bookUuid));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get comment by ID", description = "Returns a specific comment for a book in a library.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Comment retrieved successfully"),
    })
    public Response<Comment> getCommentById(@PathVariable String libraryId, @PathVariable String bookId, @PathVariable String id) {
        UUID libUuid = parseUuid(libraryId);
        UUID bookUuid = parseUuid(bookId);
        UUID commentUuid = parseUuid(id);
        genericAccessService.assertOwnerOrModeratorOrAdmin(libraryRepository::findLibraryById, libUuid);
        return Response.success(commentService.getCommentByIdInLibraryBook(libUuid, bookUuid, commentUuid));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Create comment", description = "Creates a new comment for a book in a library.")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Comment created successfully"),
    })
    public Response<Comment> createComment(@PathVariable String libraryId, @PathVariable String bookId, @Valid @RequestBody CommentRequest commentRequest) {
        UUID libUuid = parseUuid(libraryId);
        UUID bookUuid = parseUuid(bookId);
        genericAccessService.assertOwnerOrAdmin(libraryRepository::findLibraryById, libUuid);
        return Response.success(commentService.createCommentInLibraryBook(libUuid, bookUuid, commentRequest, SecurityUtils.getAuthenticatedUserPk()));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Delete comment", description = "Deletes a comment from a book in a library.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Comment deleted successfully"),
    })
    public Response<String> deleteComment(@PathVariable String libraryId, @PathVariable String bookId, @PathVariable String id) {
        UUID libUuid = parseUuid(libraryId);
        UUID bookUuid = parseUuid(bookId);
        UUID commentUuid = parseUuid(id);
        genericAccessService.assertOwnerOrModeratorOrAdmin(commentRepository::findCommentById, commentUuid);
        UUID deleted = commentService.deleteCommentByIdInLibraryBook(libUuid, bookUuid, commentUuid);
        return Response.success(deleted.toString());
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Update comment", description = "Updates a comment for a book in a library.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Comment updated successfully"),
    })
    public Response<Comment> updateComment(@PathVariable String libraryId, @PathVariable String bookId, @PathVariable String id, @Valid @RequestBody CommentUpdateRequest commentUpdateRequest) {
        UUID libUuid = parseUuid(libraryId);
        UUID bookUuid = parseUuid(bookId);
        UUID commentUuid = parseUuid(id);
        genericAccessService.assertOwnerOrAdmin(commentRepository::findCommentById, commentUuid);
        return Response.success(commentService.updateCommentInLibraryBook(libUuid, bookUuid, commentUuid, commentUpdateRequest));
    }

    private UUID parseUuid(String id) {
        try {
            return UUID.fromString(id);
        } catch (IllegalArgumentException ex) {
            throw new NotFoundException("Invalid UUID format: " + id);
        }
    }
}
