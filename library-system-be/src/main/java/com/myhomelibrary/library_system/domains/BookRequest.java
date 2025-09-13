package com.myhomelibrary.library_system.domains;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.LocalDate;

@Data
public class BookRequest {

    @NotBlank(message = "Title cannot be blank")
    @Size(min = 1, max = 255, message = "Title must be between 1 and 255 characters")
    private String title;

    @Size(max = 255, message = "Author name cannot exceed 255 characters")
    private String author;

    @Pattern(regexp = "^(97([89]))?\\d{9}(\\d|X)$", message = "Invalid ISBN format")
    private String isbn;

    @PastOrPresent(message = "Release date must be in the past or present")
    private LocalDate releaseDate;

    @Size(max = 2000, message = "Description cannot exceed 2000 characters")
    private String description;

    private String language;

    @Positive(message = "Pages must be a positive number")
    private Integer pages;

    @Size(max = 255, message = "Publisher name cannot exceed 255 characters")
    private String publisher;

    private String genre;

    private String coverImageUrl;
}
