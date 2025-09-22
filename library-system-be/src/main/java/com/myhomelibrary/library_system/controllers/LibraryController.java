package com.myhomelibrary.library_system.controllers;

import com.myhomelibrary.library_system.domains.Library.Library;
import com.myhomelibrary.library_system.domains.Library.LibraryRequest;
import com.myhomelibrary.library_system.services.LibraryService;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

import static com.myhomelibrary.library_system.controllers.LibraryController.LIBRARY_BASE_URL;

@RestController
@RequestMapping(LIBRARY_BASE_URL)
@AllArgsConstructor
public class LibraryController {
    public static final String LIBRARY_BASE_URL = "/v1/library";

    private final LibraryService libraryService;

    @GetMapping
    public Page<Library> getLibraries(@PageableDefault(size = 20) Pageable pageable) {
        return libraryService.getAllLibraries(pageable);
    }

    @GetMapping("/{id}")
    public Library getLibraryById(@PathVariable UUID id) {
        return libraryService.getLibraryById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Library createLibrary(@RequestBody LibraryRequest libraryRequest) {
        var user = 1L;
        return libraryService.createLibrary(libraryRequest, user);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public UUID deleteLibrary(@PathVariable UUID id) {
        return libraryService.deleteLibraryById(id);
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public Library updateLibrary(@PathVariable UUID id, @RequestBody LibraryRequest libraryRequest) {
        return libraryService.updateLibrary(id, libraryRequest);
    }
}
