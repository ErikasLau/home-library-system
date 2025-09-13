package com.myhomelibrary.library_system.converters;

import com.myhomelibrary.library_system.domains.Library.Library;
import com.myhomelibrary.library_system.domains.Library.LibraryRequest;
import com.myhomelibrary.library_system.entities.LibraryEntity;

public class LibraryConverter {
    public static LibraryEntity toLibraryEntity(LibraryRequest libraryRequest, Long userId) {
        return LibraryEntity.builder()
                .title(libraryRequest.getTitle())
                .description(libraryRequest.getDescription())
                .color(libraryRequest.getColor())
                .privacyStatus(libraryRequest.getPrivacyStatus())
                .isEditable(libraryRequest.isEditable())
                .userId(userId)
                .build();
    }

    public static Library toLibrary(LibraryEntity libraryEntity) {
        return Library.builder()
                .id(libraryEntity.getId())
                .title(libraryEntity.getTitle())
                .description(libraryEntity.getDescription())
                .color(libraryEntity.getColor())
                .privacyStatus(libraryEntity.getPrivacyStatus())
                .isEditable(libraryEntity.isEditable())
                .createdAt(libraryEntity.getCreatedAt())
                .updatedAt(libraryEntity.getUpdatedAt())
                .build();
    }
}
