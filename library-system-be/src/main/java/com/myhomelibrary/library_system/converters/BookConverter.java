package com.myhomelibrary.library_system.converters;

import com.myhomelibrary.library_system.domains.book.Book;
import com.myhomelibrary.library_system.domains.book.BookRequest;
import com.myhomelibrary.library_system.domains.book.BookShort;
import com.myhomelibrary.library_system.domains.book.BookUpdateRequest;
import com.myhomelibrary.library_system.entities.BookEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring", uses = UserConverter.class)
public interface BookConverter {
    @Mapping(target = "id", expression = "java(java.util.UUID.randomUUID())")
    @Mapping(target = "userId", source = "userId")
    @Mapping(target = "libraryId", source = "libraryId")
    BookEntity toBookEntity(BookRequest bookRequest, Long libraryId, Long userId);

    @Mapping(target = "creator", source = "user")
    Book toBook(BookEntity bookEntity);

    @Mapping(target = "creator", source = "user")
    BookShort toBookShort(BookEntity bookEntity);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "pk", ignore = true)
    @Mapping(target = "libraryId", ignore = true)
    @Mapping(target = "userId", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "library", ignore = true)
    @Mapping(target = "comments", ignore = true)
    @Mapping(target = "user", ignore = true)
    void updateBookEntity(BookUpdateRequest bookUpdateRequest, @MappingTarget BookEntity bookEntity);
}
