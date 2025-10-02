package com.myhomelibrary.library_system.domains.book;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Data
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
public class Book {
    private UUID id;
    private String title;
    private String author;
    private String isbn;
    private LocalDate releaseDate;
    private String description;
    private String language;
    private Integer pages;
    private String publisher;
    private String genre;
    private String coverImageUrl;
    private Instant createdAt;
    private Instant updatedAt;
}