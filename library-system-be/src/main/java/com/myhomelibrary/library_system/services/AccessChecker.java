package com.myhomelibrary.library_system.services;

import com.myhomelibrary.library_system.domains.enums.LibraryPrivacyStatus;
import com.myhomelibrary.library_system.entities.LibraryEntity;
import com.myhomelibrary.library_system.entities.OwnableResource;
import com.myhomelibrary.library_system.exceptions.ForbiddenException;
import com.myhomelibrary.library_system.exceptions.NotFoundException;
import com.myhomelibrary.library_system.security.SecurityUtils;

import java.util.UUID;

public class AccessChecker<T extends OwnableResource> {
    private final ResourceFinder<T> resourceFinder;
    private final UUID resourceId;
    private ResourceFinder<LibraryEntity> libraryFinder;
    private UUID libraryId;
    private boolean allowAdmin = false;
    private boolean allowModerator = false;
    private boolean allowOwner = false;
    private boolean allowLibraryOwner = false;
    private boolean allowPublicLibraryMember = false;

    public AccessChecker(ResourceFinder<T> resourceFinder, UUID resourceId) {
        this.resourceFinder = resourceFinder;
        this.resourceId = resourceId;
    }

    public static <T extends OwnableResource> AccessChecker<T> forResource(ResourceFinder<T> resourceFinder, UUID resourceId) {
        return new AccessChecker<>(resourceFinder, resourceId);
    }

    public AccessChecker<T> allowAdmin() {
        this.allowAdmin = true;
        return this;
    }

    public AccessChecker<T> allowModerator() {
        this.allowModerator = true;
        return this;
    }

    public AccessChecker<T> allowOwner() {
        this.allowOwner = true;
        return this;
    }

    public AccessChecker<T> allowLibraryOwner(ResourceFinder<LibraryEntity> libraryFinder, UUID libraryId) {
        this.allowLibraryOwner = true;
        this.libraryFinder = libraryFinder;
        this.libraryId = libraryId;
        return this;
    }

    public AccessChecker<T> allowPublicLibraryMember(ResourceFinder<LibraryEntity> libraryFinder, UUID libraryId) {
        this.allowPublicLibraryMember = true;
        this.libraryFinder = libraryFinder;
        this.libraryId = libraryId;
        return this;
    }

    public void check() {
        Long currentUserPk = SecurityUtils.getAuthenticatedUserPk();

        if (allowAdmin && SecurityUtils.isCurrentUserAdmin()) {
            return;
        }

        if (allowModerator && SecurityUtils.isCurrentUserModerator()) {
            return;
        }

        if (allowOwner && isResourceOwner(currentUserPk)) {
            return;
        }

        if (allowLibraryOwner && isLibraryOwner(currentUserPk)) {
            return;
        }

        if (allowPublicLibraryMember && isPublicLibraryMember(currentUserPk)) {
            return;
        }

        throw new ForbiddenException();
    }

    public void checkOwnerOnly() {
        Long currentUserPk = SecurityUtils.getAuthenticatedUserPk();
        if (!isResourceOwner(currentUserPk)) {
            throw new com.myhomelibrary.library_system.exceptions.UnauthorizedException();
        }
    }

    private boolean isResourceOwner(Long userId) {
        T resource = resourceFinder.find(resourceId).orElseThrow(NotFoundException::new);
        return resource.getOwnerId().equals(userId);
    }

    private boolean isLibraryOwner(Long userId) {
        if (libraryFinder == null || libraryId == null) {
            return false;
        }
        LibraryEntity library = libraryFinder.find(libraryId).orElseThrow(NotFoundException::new);
        return library.getOwnerId().equals(userId);
    }

    private boolean isPublicLibraryMember(Long userId) {
        if (libraryFinder == null || libraryId == null) {
            return false;
        }
        LibraryEntity library = libraryFinder.find(libraryId).orElseThrow(NotFoundException::new);
        return library.getPrivacyStatus() == LibraryPrivacyStatus.PUBLIC;
    }
}
