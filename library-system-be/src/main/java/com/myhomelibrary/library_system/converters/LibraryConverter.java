package com.myhomelibrary.library_system.converters;

import com.myhomelibrary.library_system.domains.library.Library;
import com.myhomelibrary.library_system.domains.library.LibraryRequest;
import com.myhomelibrary.library_system.entities.LibraryEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring", uses = UserConverter.class)
public interface LibraryConverter {
    @Mapping(target = "id", expression = "java(java.util.UUID.randomUUID())")
    @Mapping(target = "userId", source = "userId")
    LibraryEntity toLibraryEntity(LibraryRequest libraryRequest, Long userId);

    @Mapping(target = "creator", source = "owner")
    Library toLibrary(LibraryEntity libraryEntity);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "pk", ignore = true)
    @Mapping(target = "userId", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "books", ignore = true)
    @Mapping(target = "owner", ignore = true)
    void updateLibraryEntity(LibraryRequest libraryRequest, @MappingTarget LibraryEntity libraryEntity);
}
