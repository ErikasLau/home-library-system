package com.myhomelibrary.library_system.controllers;

import com.myhomelibrary.library_system.domains.api.Response;
import com.myhomelibrary.library_system.domains.library.Library;
import com.myhomelibrary.library_system.domains.library.LibraryRequest;
import com.myhomelibrary.library_system.repositories.LibraryRepository;
import com.myhomelibrary.library_system.security.SecurityUtils;
import com.myhomelibrary.library_system.services.GenericAccessService;
import com.myhomelibrary.library_system.services.LibraryService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

import static com.myhomelibrary.library_system.controllers.LibraryController.LIBRARY_BASE_URL;

@RestController
@RequestMapping(LIBRARY_BASE_URL)
@AllArgsConstructor
public class LibraryController {
    public static final String LIBRARY_BASE_URL = "/v1/library";

    private final LibraryService libraryService;
    private final LibraryRepository libraryRepository;
    private final GenericAccessService genericAccessService;

    @GetMapping
    public Response<Page<Library>> getLibraries(@PageableDefault(size = 20) Pageable pageable) {
        Long userPk = SecurityUtils.getAuthenticatedUserPk();
        return Response.success(libraryService.getLibrariesByUserId(pageable, userPk));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/all")
    public Response<Page<Library>> getAllLibraries(@PageableDefault(size = 20) Pageable pageable) {
        return Response.success(libraryService.getAllLibraries(pageable));
    }

    @GetMapping("/{id}")
    public Response<Library> getLibraryById(@PathVariable UUID id) {
        genericAccessService.assertOwnerOrAdmin(libraryRepository::findLibraryById, id);
        return Response.success(libraryService.getLibraryById(id));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Response<Library> createLibrary(@Valid @RequestBody LibraryRequest libraryRequest) {
        return Response.success(libraryService.createLibrary(libraryRequest, SecurityUtils.getAuthenticatedUserPk()));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public Response<UUID> deleteLibrary(@PathVariable UUID id) {
        genericAccessService.assertOwnerOrAdmin(libraryRepository::findLibraryById, id);
        return Response.success(libraryService.deleteLibraryById(id));
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public Response<Library> updateLibrary(@PathVariable UUID id, @Valid @RequestBody LibraryRequest libraryRequest) {
        genericAccessService.assertOwnerOrAdmin(libraryRepository::findLibraryById, id);
        return Response.success(libraryService.updateLibrary(id, libraryRequest));
    }
}
