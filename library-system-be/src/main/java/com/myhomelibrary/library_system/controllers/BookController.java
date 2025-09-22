package com.myhomelibrary.library_system.controllers;

import com.myhomelibrary.library_system.domains.Book.*;
import com.myhomelibrary.library_system.services.BookService;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

import static com.myhomelibrary.library_system.controllers.BookController.BOOK_BASE_URL;

@RestController
@RequestMapping(BOOK_BASE_URL)
@AllArgsConstructor
public class BookController {
    public static final String BOOK_BASE_URL = "/v1/book";

    private final BookService bookService;

    @GetMapping
    public Page<BookShort> getBooks(@PageableDefault(size = 20) Pageable pageable) {
        return bookService.getAllBooks(pageable);
    }

    @GetMapping("/{id}")
    public BookWithComments getBookById(@PathVariable UUID id) {
        return bookService.getBookById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Book createBook(@RequestBody BookRequest bookRequest) {
        var user = 1L;
        return bookService.createBook(bookRequest, user);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public UUID deleteBook(@PathVariable UUID id) {
        return bookService.deleteBookById(id);
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public BookWithComments updateBook(@PathVariable UUID id, @RequestBody BookUpdateRequest bookUpdateRequest) {
        return bookService.updateBook(id, bookUpdateRequest);
    }
}
