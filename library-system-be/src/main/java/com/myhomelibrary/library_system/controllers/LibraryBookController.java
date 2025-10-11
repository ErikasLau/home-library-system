package com.myhomelibrary.library_system.controllers;

import com.myhomelibrary.library_system.domains.api.Response;
import com.myhomelibrary.library_system.domains.book.*;
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
    public Page<BookShort> getBooks(@PathVariable UUID libraryId, @PageableDefault(size = 20) Pageable pageable) {
        genericAccessService.assertOwnerOrAdmin(libraryRepository::findLibraryById, libraryId);
        return bookService.getAllBooksByLibraryId(libraryId, pageable);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get book by ID", description = "Returns details of a specific book in the library, including comments.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Book retrieved successfully"),
    })
    public Response<BookWithComments> getBookById(@PathVariable UUID libraryId, @PathVariable UUID id) {
        genericAccessService.assertOwnerOrAdmin(libraryRepository::findLibraryById, libraryId);
        return Response.success(bookService.getBookByIdInLibrary(libraryId, id));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Create book", description = "Creates a new book in the specified library.")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Book created successfully"),
    })
    public Response<Book> createBook(@PathVariable UUID libraryId, @Valid @RequestBody BookRequest bookRequest) {
        genericAccessService.assertOwnerOrAdmin(libraryRepository::findLibraryById, libraryId);
        return Response.success(bookService.createBookInLibrary(libraryId, bookRequest, SecurityUtils.getAuthenticatedUserPk()));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Delete book", description = "Deletes a book from the specified library.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Book deleted successfully"),
    })
    public Response<UUID> deleteBook(@PathVariable UUID libraryId, @PathVariable UUID id) {
        genericAccessService.assertOwnerOrAdmin(bookRepository::findBookById, id);
        return Response.success(bookService.deleteBookByIdInLibrary(libraryId, id));
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Update book", description = "Updates details of a book in the specified library.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Book updated successfully"),
    })
    public Response<BookWithComments> updateBook(@PathVariable UUID libraryId, @PathVariable UUID id, @Valid @RequestBody BookUpdateRequest bookUpdateRequest) {
        genericAccessService.assertOwnerOrAdmin(bookRepository::findBookById, id);
        return Response.success(bookService.updateBookInLibrary(libraryId, id, bookUpdateRequest));
    }
}
