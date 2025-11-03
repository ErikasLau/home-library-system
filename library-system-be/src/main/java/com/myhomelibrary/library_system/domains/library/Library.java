package com.myhomelibrary.library_system.domains.library;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.myhomelibrary.library_system.domains.enums.LibraryPrivacyStatus;
import com.myhomelibrary.library_system.domains.user.UserShort;
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
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSX", timezone = "UTC")
        Instant createdAt,
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSX", timezone = "UTC")
        Instant updatedAt,
        UserShort creator
) {
}
