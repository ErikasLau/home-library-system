package com.myhomelibrary.library_system.controllers;

import com.myhomelibrary.library_system.domains.api.Response;
import com.myhomelibrary.library_system.domains.book.*;
import com.myhomelibrary.library_system.exceptions.NotFoundException;
import com.myhomelibrary.library_system.repositories.BookRepository;
import com.myhomelibrary.library_system.repositories.LibraryRepository;
import com.myhomelibrary.library_system.security.SecurityUtils;
import com.myhomelibrary.library_system.services.BookService;
import com.myhomelibrary.library_system.services.GenericAccessService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

import static com.myhomelibrary.library_system.controllers.LibraryController.LIBRARY_BASE_URL;

@RestController
@RequestMapping(LIBRARY_BASE_URL + "/{libraryId}/books")
@AllArgsConstructor
@Tag(name = "Library Books", description = "Operations related to books in a library")
public class LibraryBookController {
    private final BookService bookService;
    private final BookRepository bookRepository;
    private final LibraryRepository libraryRepository;
    private final GenericAccessService genericAccessService;

    @GetMapping
    @Operation(summary = "Get books in library", description = "Returns a paginated list of books for the specified library.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Books retrieved successfully"),
    })
    public Page<BookShort> getBooks(@PathVariable String libraryId, @PageableDefault(size = 20) Pageable pageable) {
        UUID libUuid = parseUuid(libraryId);
        genericAccessService.assertOwnerOrAdmin(libraryRepository::findLibraryById, libUuid);
        return bookService.getAllBooksByLibraryId(libUuid, pageable);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get book by ID", description = "Returns details of a specific book in the library, including comments.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Book retrieved successfully"),
    })
    public Response<BookWithComments> getBookById(@PathVariable String libraryId, @PathVariable String id) {
        UUID libUuid = parseUuid(libraryId);
        UUID bookUuid = parseUuid(id);
        genericAccessService.assertOwnerOrAdmin(libraryRepository::findLibraryById, libUuid);
        return Response.success(bookService.getBookByIdInLibrary(libUuid, bookUuid));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Create book", description = "Creates a new book in the specified library.")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Book created successfully"),
    })
    public Response<Book> createBook(@PathVariable String libraryId, @Valid @RequestBody BookRequest bookRequest) {
        UUID libUuid = parseUuid(libraryId);
        genericAccessService.assertOwnerOrAdmin(libraryRepository::findLibraryById, libUuid);
        return Response.success(bookService.createBookInLibrary(libUuid, bookRequest, SecurityUtils.getAuthenticatedUserPk()));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Delete book", description = "Deletes a book from the specified library.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Book deleted successfully"),
    })
    public Response<String> deleteBook(@PathVariable String libraryId, @PathVariable String id) {
        UUID bookUuid = parseUuid(id);
        genericAccessService.assertOwnerOrAdmin(bookRepository::findBookById, bookUuid);
        UUID deleted = bookService.deleteBookByIdInLibrary(parseUuid(libraryId), bookUuid);
        return Response.success(deleted.toString());
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Update book", description = "Updates details of a book in the specified library.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Book updated successfully"),
    })
    public Response<BookWithComments> updateBook(@PathVariable String libraryId, @PathVariable String id, @Valid @RequestBody BookUpdateRequest bookUpdateRequest) {
        UUID libUuid = parseUuid(libraryId);
        UUID bookUuid = parseUuid(id);
        genericAccessService.assertOwnerOrAdmin(bookRepository::findBookById, bookUuid);
        return Response.success(bookService.updateBookInLibrary(libUuid, bookUuid, bookUpdateRequest));
    }

    private UUID parseUuid(String id) {
        try {
            return UUID.fromString(id);
        } catch (IllegalArgumentException ex) {
            throw new NotFoundException("Invalid UUID format: " + id);
        }
    }
}
