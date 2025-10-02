package com.myhomelibrary.library_system.domains.library;

import com.myhomelibrary.library_system.domains.enums.LibraryPrivacyStatus;
import lombok.Builder;

import java.time.Instant;
import java.util.UUID;

@Builder
public record Library(
        UUID id,
        String title,
        String description,
        String color,
        LibraryPrivacyStatus privacyStatus,
        boolean isEditable,
        Instant createdAt,
        Instant updatedAt
) {
}
