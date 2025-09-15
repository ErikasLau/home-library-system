package com.myhomelibrary.library_system.controllers;

import com.myhomelibrary.library_system.services.BookService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import static com.myhomelibrary.library_system.controllers.BookController.BOOK_BASE_URL;

@RestController
@RequestMapping(BOOK_BASE_URL)
@AllArgsConstructor
public class BookController {
    public static final String BOOK_BASE_URL = "/v1/book";

    private final BookService bookService;

    @GetMapping
    public String getLibraries() {
        return "Hello from BookController";
    }

    @GetMapping
    public String getLibraryById() {
        return "Hello from BookController";
    }

    @PostMapping
    public String createLibrary() {
        return "Hello from BookController";
    }

    @DeleteMapping
    public String deleteLibrary() {
        return "Hello from BookController";
    }

    @PutMapping
    public String updateLibrary() {
        return "Hello from BookController";
    }
}
