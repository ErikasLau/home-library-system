package com.myhomelibrary.library_system.domains.Book;

import lombok.Data;

import java.time.LocalDate;

@Data
public class BookUpdateRequest {
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
}

