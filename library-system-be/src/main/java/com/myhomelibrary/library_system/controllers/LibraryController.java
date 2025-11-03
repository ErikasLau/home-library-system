package com.myhomelibrary.library_system.controllers;

import com.myhomelibrary.library_system.domains.api.Response;
import com.myhomelibrary.library_system.domains.library.Library;
import com.myhomelibrary.library_system.domains.library.LibraryRequest;
import com.myhomelibrary.library_system.exceptions.NotFoundException;
import com.myhomelibrary.library_system.repositories.LibraryRepository;
import com.myhomelibrary.library_system.security.SecurityUtils;
import com.myhomelibrary.library_system.services.GenericAccessService;
import com.myhomelibrary.library_system.services.LibraryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

import static com.myhomelibrary.library_system.controllers.LibraryController.LIBRARY_BASE_URL;

@RestController
@RequestMapping(LIBRARY_BASE_URL)
@AllArgsConstructor
@Tag(name = "Libraries", description = "Operations related to libraries")
public class LibraryController {
    public static final String LIBRARY_BASE_URL = "/v1/library";

    private final LibraryService libraryService;
    private final LibraryRepository libraryRepository;
    private final GenericAccessService genericAccessService;

    @GetMapping
    @Operation(summary = "Get user libraries", description = "Returns all libraries for the authenticated user.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Libraries retrieved successfully"),
    })
    public Response<List<Library>> getLibraries() {
        Long userPk = SecurityUtils.getAuthenticatedUserPk();
        return Response.success(libraryService.getLibrariesByUserId(userPk));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/all")
    @Operation(summary = "Get all libraries (admin)", description = "Returns all libraries. Admin only.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Libraries retrieved successfully"),
    })
    public Response<List<Library>> getAllLibraries() {
        return Response.success(libraryService.getAllLibraries());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get library by ID", description = "Returns details of a specific library.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Library retrieved successfully"),
    })
    public Response<Library> getLibraryById(@PathVariable String id) {
        UUID uuid = parseUuid(id);
        genericAccessService.assertOwnerOrAdmin(libraryRepository::findLibraryById, uuid);
        return Response.success(libraryService.getLibraryById(uuid));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Create library", description = "Creates a new library for the authenticated user.")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Library created successfully"),
    })
    public Response<Library> createLibrary(@Valid @RequestBody LibraryRequest libraryRequest) {
        return Response.success(libraryService.createLibrary(libraryRequest, SecurityUtils.getAuthenticatedUserPk()));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Delete library", description = "Deletes a library by ID.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Library deleted successfully"),
    })
    public Response<String> deleteLibrary(@PathVariable String id) {
        UUID uuid = parseUuid(id);
        genericAccessService.assertOwnerOrAdmin(libraryRepository::findLibraryById, uuid);
        var deleted = libraryService.deleteLibraryById(uuid);
        return Response.success(deleted.toString());
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Update library", description = "Updates details of a library by ID.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Library updated successfully"),
    })
    public Response<Library> updateLibrary(@PathVariable String id, @Valid @RequestBody LibraryRequest libraryRequest) {
        UUID uuid = parseUuid(id);
        genericAccessService.assertOwnerOrAdmin(libraryRepository::findLibraryById, uuid);
        return Response.success(libraryService.updateLibrary(uuid, libraryRequest));
    }

    private UUID parseUuid(String id) {
        try {
            return UUID.fromString(id);
        } catch (IllegalArgumentException ex) {
            throw new NotFoundException("Invalid UUID format: " + id);
        }
    }
}
