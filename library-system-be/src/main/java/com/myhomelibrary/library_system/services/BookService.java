package com.myhomelibrary.library_system.services;

import com.myhomelibrary.library_system.converters.BookConverter;
import com.myhomelibrary.library_system.converters.CommentConverter;
import com.myhomelibrary.library_system.domains.book.*;
import com.myhomelibrary.library_system.exceptions.NotFoundException;
import com.myhomelibrary.library_system.repositories.BookRepository;
import com.myhomelibrary.library_system.repositories.LibraryRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@AllArgsConstructor
@Transactional
public class BookService {
    private final BookRepository bookRepository;
    private final LibraryRepository libraryRepository;
    private final BookConverter bookConverter;
    private final CommentConverter commentConverter;

    @Transactional(readOnly = true)
    public List<BookShort> getAllBooksByLibraryId(UUID libraryId) {
        return bookRepository.findAllBooksByLibrary_Id(libraryId)
                .stream()
                .map(bookConverter::toBookShort)
                .sorted((b1, b2) -> {
                    int result = b2.updatedAt().compareTo(b1.updatedAt());
                    return result != 0 ? result : b2.createdAt().compareTo(b1.createdAt());
                })
                .toList();
    }

    @Transactional(readOnly = true)
    public BookWithComments getBookByIdInLibrary(UUID libraryId, UUID id) {
        var bookEntity = bookRepository.findBookByIdAndLibrary_Id(id, libraryId).orElseThrow(NotFoundException::new);
        var comments = bookEntity.getComments().stream()
                .map(commentConverter::toComment)
                .sorted((c1, c2) -> {
                    int result = c2.updatedAt().compareTo(c1.updatedAt());
                    return result != 0 ? result : c2.createdAt().compareTo(c1.createdAt());
                })
                .toList();
        var book = bookConverter.toBook(bookEntity);
        return new BookWithComments(book, comments);
    }

    @Transactional
    public BookWithComments updateBookInLibrary(UUID libraryId, UUID id, BookUpdateRequest bookUpdateRequest) {
        var bookEntity = bookRepository.findBookByIdAndLibrary_Id(id, libraryId).orElseThrow(NotFoundException::new);
        bookConverter.updateBookEntity(bookUpdateRequest, bookEntity);
        var savedBookEntity = bookRepository.save(bookEntity);
        var comments = savedBookEntity.getComments().stream()
                .map(commentConverter::toComment)
                .sorted((c1, c2) -> {
                    int result = c2.updatedAt().compareTo(c1.updatedAt());
                    return result != 0 ? result : c2.createdAt().compareTo(c1.createdAt());
                })
                .toList();
        var book = bookConverter.toBook(savedBookEntity);
        return new BookWithComments(book, comments);
    }

    @Transactional
    public UUID deleteBookByIdInLibrary(UUID libraryId, UUID id) {
        var book = bookRepository.findBookByIdAndLibrary_Id(id, libraryId).orElseThrow(NotFoundException::new);
        bookRepository.deleteById(book.getPk());
        return book.getId();
    }

    @Transactional
    public Book createBookInLibrary(UUID libraryId, BookRequest bookRequest, Long userId) {
        var library = libraryRepository.findLibraryById(libraryId).orElseThrow(NotFoundException::new);
        var bookEntity = bookConverter.toBookEntity(bookRequest, library.getPk(), userId);
        var savedBookEntity = bookRepository.save(bookEntity);
        var entityWithUser = bookRepository.findBookById(savedBookEntity.getId()).orElseThrow();
        return bookConverter.toBook(entityWithUser);
    }
}