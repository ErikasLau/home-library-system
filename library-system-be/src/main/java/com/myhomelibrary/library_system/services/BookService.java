package com.myhomelibrary.library_system.services;

import com.myhomelibrary.library_system.converters.BookConverter;
import com.myhomelibrary.library_system.converters.CommentConverter;
import com.myhomelibrary.library_system.domains.Book.*;
import com.myhomelibrary.library_system.exceptions.NotFoundException;
import com.myhomelibrary.library_system.repositories.BookRepository;
import com.myhomelibrary.library_system.repositories.LibraryRepository;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@AllArgsConstructor
@Transactional
public class BookService {
    private final BookRepository bookRepository;
    private final LibraryRepository libraryRepository;

    @Transactional(readOnly = true)
    public BookWithComments getBookById(UUID id) {
        var bookEntity = bookRepository.findBookById(id).orElseThrow(NotFoundException::new);
        var comments = bookEntity.getComments().stream().map(CommentConverter::toComment).toList();
        var book = BookConverter.toBook(bookEntity);

        return new BookWithComments(book, comments);
    }

    @Transactional(readOnly = true)
    public Page<BookShort> getAllBooks(Pageable pageable) {
        return bookRepository.findAll(pageable)
                .map(BookConverter::toBookShort);
    }

    @Transactional
    public BookWithComments updateBook(UUID id, BookUpdateRequest bookUpdateRequest) {
        var bookEntity = bookRepository.findBookById(id).orElseThrow(NotFoundException::new);

        bookEntity.setTitle(bookUpdateRequest.getTitle());
        bookEntity.setAuthor(bookUpdateRequest.getAuthor());
        bookEntity.setIsbn(bookUpdateRequest.getIsbn());
        bookEntity.setReleaseDate(bookUpdateRequest.getReleaseDate());
        bookEntity.setDescription(bookUpdateRequest.getDescription());
        bookEntity.setLanguage(bookUpdateRequest.getLanguage());
        bookEntity.setPages(bookUpdateRequest.getPages());
        bookEntity.setPublisher(bookUpdateRequest.getPublisher());
        bookEntity.setGenre(bookUpdateRequest.getGenre());
        bookEntity.setCoverImageUrl(bookUpdateRequest.getCoverImageUrl());

        var savedBookEntity = bookRepository.save(bookEntity);
        var comments = savedBookEntity.getComments().stream().map(CommentConverter::toComment).toList();
        var book = BookConverter.toBook(savedBookEntity);
        return new BookWithComments(book, comments);
    }

    @Transactional
    public UUID deleteBookById(UUID id) {
        var book = bookRepository.findBookById(id).orElseThrow(NotFoundException::new);
        bookRepository.deleteById(book.getPk());
        return book.getId();
    }

    @Transactional
    public Book createBook(BookRequest bookRequest, Long userId) {
        var library = libraryRepository.findLibraryById(bookRequest.getLibraryId()).orElseThrow(NotFoundException::new);
        var bookEntity = BookConverter.toBookEntity(bookRequest, library.getPk(), userId);
        var savedBookEntity = bookRepository.save(bookEntity);
        return BookConverter.toBook(savedBookEntity);
    }
}