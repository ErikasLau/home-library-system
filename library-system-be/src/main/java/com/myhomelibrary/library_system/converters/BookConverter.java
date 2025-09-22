package com.myhomelibrary.library_system.converters;

import com.myhomelibrary.library_system.domains.Book.Book;
import com.myhomelibrary.library_system.domains.Book.BookRequest;
import com.myhomelibrary.library_system.domains.Book.BookShort;
import com.myhomelibrary.library_system.entities.BookEntity;

import java.util.UUID;

public class BookConverter {
    public static BookEntity toBookEntity(BookRequest bookRequest, Long libraryId, Long userId) {
        return BookEntity.builder()
                .id(UUID.randomUUID())
                .title(bookRequest.getTitle())
                .author(bookRequest.getAuthor())
                .isbn(bookRequest.getIsbn())
                .releaseDate(bookRequest.getReleaseDate())
                .description(bookRequest.getDescription())
                .language(bookRequest.getLanguage())
                .pages(bookRequest.getPages())
                .publisher(bookRequest.getPublisher())
                .genre(bookRequest.getGenre())
                .coverImageUrl(bookRequest.getCoverImageUrl())
                .libraryId(libraryId)
                .userId(userId)
                .build();
    }

    public static Book toBook(BookEntity bookEntity) {
        return Book.builder()
                .id(bookEntity.getId())
                .title(bookEntity.getTitle())
                .author(bookEntity.getAuthor())
                .isbn(bookEntity.getIsbn())
                .releaseDate(bookEntity.getReleaseDate())
                .description(bookEntity.getDescription())
                .language(bookEntity.getLanguage())
                .pages(bookEntity.getPages())
                .publisher(bookEntity.getPublisher())
                .genre(bookEntity.getGenre())
                .coverImageUrl(bookEntity.getCoverImageUrl())
                .createdAt(bookEntity.getCreatedAt())
                .updatedAt(bookEntity.getUpdatedAt())
                .build();
    }

    public static BookShort toBookShort(BookEntity bookEntity) {
        return BookShort.builder()
                .id(bookEntity.getId())
                .title(bookEntity.getTitle())
                .author(bookEntity.getAuthor())
                .releaseDate(bookEntity.getReleaseDate())
                .language(bookEntity.getLanguage())
                .coverImageUrl(bookEntity.getCoverImageUrl())
                .createdAt(bookEntity.getCreatedAt())
                .updatedAt(bookEntity.getUpdatedAt())
                .build();
    }
}
