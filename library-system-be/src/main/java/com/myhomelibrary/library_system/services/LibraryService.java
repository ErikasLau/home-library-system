package com.myhomelibrary.library_system.services;

import com.myhomelibrary.library_system.converters.LibraryConverter;
import com.myhomelibrary.library_system.domains.library.Library;
import com.myhomelibrary.library_system.domains.library.LibraryRequest;
import com.myhomelibrary.library_system.exceptions.NotFoundException;
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
public class LibraryService {
    private final LibraryRepository libraryRepository;
    private final LibraryConverter libraryConverter;

    @Transactional(readOnly = true)
    public Library getLibraryById(UUID id) {
        return libraryConverter.toLibrary(libraryRepository.findLibraryById(id).orElseThrow(NotFoundException::new));
    }

    @Transactional(readOnly = true)
    public Page<Library> getAllLibraries(Pageable pageable) {
        return libraryRepository.findAll(pageable)
                .map(libraryConverter::toLibrary);
    }

    @Transactional(readOnly = true)
    public Page<Library> getLibrariesByUserId(Pageable pageable, Long userPk) {
        return libraryRepository.findAllByUserId(userPk, pageable)
                .map(libraryConverter::toLibrary);
    }

    @Transactional
    public UUID deleteLibraryById(UUID id) {
        var library = libraryRepository.findLibraryById(id).orElseThrow(NotFoundException::new);
        libraryRepository.deleteById(library.getPk());
        return library.getId();
    }

    @Transactional
    public Library createLibrary(LibraryRequest libraryRequest, Long userId) {
        var libraryEntity = libraryConverter.toLibraryEntity(libraryRequest, userId);
        var savedLibraryEntity = libraryRepository.save(libraryEntity);
        return libraryConverter.toLibrary(savedLibraryEntity);
    }

    @Transactional
    public Library updateLibrary(UUID id, LibraryRequest libraryRequest) {
        var libraryEntity = libraryRepository.findLibraryById(id).orElseThrow(NotFoundException::new);
        libraryConverter.updateLibraryEntity(libraryRequest, libraryEntity);
        var savedLibraryEntity = libraryRepository.save(libraryEntity);
        return libraryConverter.toLibrary(savedLibraryEntity);
    }
}
