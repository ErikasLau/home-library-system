package com.myhomelibrary.library_system.services;

import com.myhomelibrary.library_system.converters.BookConverter;
import com.myhomelibrary.library_system.domains.Book.Book;
import com.myhomelibrary.library_system.domains.Book.BookRequest;
import com.myhomelibrary.library_system.domains.Book.BookShort;
import com.myhomelibrary.library_system.exceptions.NotFoundException;
import com.myhomelibrary.library_system.repositories.BookRepository;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@AllArgsConstructor
@Transactional
public class BookService {
    private final BookRepository bookRepository;

    @Transactional(readOnly = true)
    public Book getBookById(UUID id) {
        return BookConverter.toBook(bookRepository.findBookById(id).orElseThrow(NotFoundException::new));
    }

    @Transactional(readOnly = true)
    public Page<BookShort> getAllBooks(int pageNumber, int pageSize, Sort sort) {
        Pageable pageable = PageRequest.of(pageNumber, pageSize, sort);
        return bookRepository.findAll(pageable)
                .map(BookConverter::toBookShort);
    }

    @Transactional
    public Book updateBook(UUID id, BookRequest bookRequest) {
        var bookEntity = bookRepository.findBookById(id).orElseThrow(NotFoundException::new);

        bookEntity.setTitle(bookRequest.getTitle());
        bookEntity.setAuthor(bookRequest.getAuthor());
        bookEntity.setIsbn(bookRequest.getIsbn());
        bookEntity.setReleaseDate(bookRequest.getReleaseDate());
        bookEntity.setDescription(bookRequest.getDescription());
        bookEntity.setLanguage(bookRequest.getLanguage());
        bookEntity.setPages(bookRequest.getPages());
        bookEntity.setPublisher(bookRequest.getPublisher());
        bookEntity.setGenre(bookRequest.getGenre());
        bookEntity.setCoverImageUrl(bookRequest.getCoverImageUrl());

        var savedBookEntity = bookRepository.save(bookEntity);
        return BookConverter.toBook(savedBookEntity);
    }


    @Transactional
    public UUID deleteBookById(UUID id) {
        var book = bookRepository.findBookById(id).orElseThrow(NotFoundException::new);
        bookRepository.deleteById(book.getPk());
        return book.getId();
    }

    @Transactional
    public Book createBook(BookRequest bookRequest) {
        var bookEntity = BookConverter.toBookEntity(bookRequest);
        var savedBookEntity = bookRepository.save(bookEntity);
        return BookConverter.toBook(savedBookEntity);
    }
}