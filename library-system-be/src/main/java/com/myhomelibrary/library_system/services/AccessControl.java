package com.myhomelibrary.library_system.services;

import com.myhomelibrary.library_system.entities.LibraryEntity;
import com.myhomelibrary.library_system.entities.OwnableResource;

import java.util.UUID;

public class AccessControl {


    public static <T extends OwnableResource> void requireOwner(ResourceFinder<T> finder, UUID resourceId) {
        AccessChecker.forResource(finder, resourceId).checkOwnerOnly();
    }

    public static <T extends OwnableResource> void requireOwnerOrAdmin(ResourceFinder<T> finder, UUID resourceId) {
        AccessChecker.forResource(finder, resourceId)
                .allowAdmin()
                .allowOwner()
                .check();
    }

    public static void requireLibraryAccess(ResourceFinder<LibraryEntity> libraryFinder, UUID libraryId) {
        AccessChecker.forResource(libraryFinder, libraryId)
                .allowAdmin()
                .allowModerator()
                .allowOwner()
                .allowPublicLibraryMember(libraryFinder, libraryId)
                .check();
    }

    public static <T extends OwnableResource> void requireBookPermissions(ResourceFinder<T> bookFinder, UUID bookId, ResourceFinder<LibraryEntity> libraryFinder, UUID libraryId) {
        AccessChecker.forResource(bookFinder, bookId)
                .allowAdmin()
                .allowOwner()
                .allowLibraryOwner(libraryFinder, libraryId)
                .allowPublicLibraryMember(libraryFinder, libraryId)
                .check();
    }

    public static <T extends OwnableResource> void requireBookViewPermissions(ResourceFinder<T> bookFinder, UUID bookId, ResourceFinder<LibraryEntity> libraryFinder, UUID libraryId) {
        AccessChecker.forResource(bookFinder, bookId)
                .allowAdmin()
                .allowModerator()
                .allowOwner()
                .allowLibraryOwner(libraryFinder, libraryId)
                .allowPublicLibraryMember(libraryFinder, libraryId)
                .check();
    }

    public static <T extends OwnableResource> void requireCommentPermissions(ResourceFinder<T> commentFinder, UUID commentId, ResourceFinder<LibraryEntity> libraryFinder, UUID libraryId) {
        AccessChecker.forResource(commentFinder, commentId)
                .allowAdmin()
                .allowModerator()
                .allowOwner()
                .allowLibraryOwner(libraryFinder, libraryId)
                .allowPublicLibraryMember(libraryFinder, libraryId)
                .check();
    }
}
