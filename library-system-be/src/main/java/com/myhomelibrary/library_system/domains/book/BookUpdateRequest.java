package com.myhomelibrary.library_system.domains.book;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDate;

public record BookUpdateRequest(
        String title,
        String author,
        String isbn,
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd", timezone = "UTC")
        LocalDate releaseDate,
        String description,
        String language,
        Integer pages,
        String publisher,
        String genre,
        String coverImageUrl
) {
}

