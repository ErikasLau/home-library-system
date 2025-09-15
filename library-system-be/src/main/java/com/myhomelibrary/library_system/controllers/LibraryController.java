package com.myhomelibrary.library_system.controllers;

import com.myhomelibrary.library_system.services.LibraryService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import static com.myhomelibrary.library_system.controllers.LibraryController.LIBRARY_BASE_URL;

@RestController
@RequestMapping(LIBRARY_BASE_URL)
@AllArgsConstructor
public class LibraryController {
    public static final String LIBRARY_BASE_URL = "/v1/library";

    private final LibraryService libraryService;

    @GetMapping
    public String getLibraries() {
        return "Hello from LibraryController";
    }

    @GetMapping
    public String getLibraryById() {
        return "Hello from LibraryController";
    }

    @PostMapping
    public String createLibrary() {
        return "Hello from LibraryController";
    }

    @DeleteMapping
    public String deleteLibrary() {
        return "Hello from LibraryController";
    }

    @PutMapping
    public String updateLibrary() {
        return "Hello from LibraryController";
    }
}
