package com.myhomelibrary.library_system.domains;

import lombok.Builder;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Builder(toBuilder = true)
public record BookShort(
        UUID id,
        String title,
        String author,
        LocalDate releaseDate,
        String language,
        String coverImageUrl,
        Instant createdAt,
        Instant updatedAt
) {

}