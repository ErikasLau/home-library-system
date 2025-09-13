package com.myhomelibrary.library_system.domains.Book;

import lombok.Builder;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Builder(toBuilder = true)
public record Book(
        UUID id,
        String title,
        String author,
        String isbn,
        LocalDate releaseDate,
        String description,
        String language,
        Integer pages,
        String publisher,
        String genre,
        String coverImageUrl,
        Instant createdAt,
        Instant updatedAt
) {

}