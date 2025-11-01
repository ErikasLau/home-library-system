package com.myhomelibrary.library_system.domains.book;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record BookRequest(
        @NotBlank(message = "Title cannot be blank")
        @Size(min = 1, max = 255, message = "Title must be between 1 and 255 characters")
        String title,

        @Size(max = 255, message = "Author name cannot exceed 255 characters")
        String author,

        String isbn,

        @PastOrPresent(message = "Release date must be in the past or present")
        LocalDate releaseDate,

        @Size(max = 2000, message = "Description cannot exceed 2000 characters")
        String description,

        String language,

        @Positive(message = "Pages must be a positive number")
        Integer pages,

        @Size(max = 255, message = "Publisher name cannot exceed 255 characters")
        String publisher,

        String genre,

        String coverImageUrl
) {
}
