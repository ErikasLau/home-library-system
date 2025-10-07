package com.myhomelibrary.library_system.controllers;

import com.myhomelibrary.library_system.domains.api.Response;
import com.myhomelibrary.library_system.domains.book.*;
import com.myhomelibrary.library_system.security.SecurityUtils;
import com.myhomelibrary.library_system.services.BookService;
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
public class LibraryBookController {
    private final BookService bookService;

    @GetMapping
    public Page<BookShort> getBooks(@PathVariable UUID libraryId, @PageableDefault(size = 20) Pageable pageable) {
        return bookService.getAllBooksByLibraryId(libraryId, pageable);
    }

    @GetMapping("/{id}")
    public Response<BookWithComments> getBookById(@PathVariable UUID libraryId, @PathVariable UUID id) {
        return Response.success(bookService.getBookByIdInLibrary(libraryId, id));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Response<Book> createBook(@PathVariable UUID libraryId, @RequestBody BookRequest bookRequest) {
        return Response.success(bookService.createBookInLibrary(libraryId, bookRequest, SecurityUtils.getAuthenticatedUserPk()));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public Response<UUID> deleteBook(@PathVariable UUID libraryId, @PathVariable UUID id) {
        return Response.success(bookService.deleteBookByIdInLibrary(libraryId, id));
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public Response<BookWithComments> updateBook(@PathVariable UUID libraryId, @PathVariable UUID id, @RequestBody BookUpdateRequest bookUpdateRequest) {
        return Response.success(bookService.updateBookInLibrary(libraryId, id, bookUpdateRequest));
    }
}

