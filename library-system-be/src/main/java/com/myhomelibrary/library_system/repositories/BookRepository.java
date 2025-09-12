package com.myhomelibrary.library_system.repositories;

import com.myhomelibrary.library_system.entities.Book;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface BookRepository extends JpaRepository<Book, Long> {
    Optional<Book> findBookById(UUID id);
}
