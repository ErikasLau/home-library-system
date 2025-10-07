package com.myhomelibrary.library_system.controllers;

import com.myhomelibrary.library_system.domains.api.Response;
import com.myhomelibrary.library_system.domains.library.Library;
import com.myhomelibrary.library_system.domains.library.LibraryRequest;
import com.myhomelibrary.library_system.services.LibraryService;
import com.myhomelibrary.library_system.security.SecurityUtils;
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
    public Response<Page<Library>> getLibraries(@PageableDefault(size = 20) Pageable pageable) {
        // TODO: Only return user libraries? A separate endpoint for all libraries? Admin can access all
        return Response.success(libraryService.getAllLibraries(pageable));
    }

    @GetMapping("/{id}")
    public Response<Library> getLibraryById(@PathVariable UUID id) {
        // TODO: Check if user has access to this library
        return Response.success(libraryService.getLibraryById(id));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Response<Library> createLibrary(@RequestBody LibraryRequest libraryRequest) {
        return Response.success(libraryService.createLibrary(libraryRequest, SecurityUtils.getAuthenticatedUserPk()));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public Response<UUID> deleteLibrary(@PathVariable UUID id) {
        // TODO: Check if user has access to delete this library
        return Response.success(libraryService.deleteLibraryById(id));
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public Response<Library> updateLibrary(@PathVariable UUID id, @RequestBody LibraryRequest libraryRequest) {
        // TODO: Check if user has access to update this library. So maybe admin and the owner?
        return Response.success(libraryService.updateLibrary(id, libraryRequest));
    }
}
