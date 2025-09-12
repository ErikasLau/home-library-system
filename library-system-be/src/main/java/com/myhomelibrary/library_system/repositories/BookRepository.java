package com.myhomelibrary.library_system.repositories;

import com.myhomelibrary.library_system.entities.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {
    Optional<Book> findBookById(UUID id);
}
