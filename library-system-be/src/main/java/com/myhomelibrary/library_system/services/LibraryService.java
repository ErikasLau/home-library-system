package com.myhomelibrary.library_system.services;

import com.myhomelibrary.library_system.converters.LibraryConverter;
import com.myhomelibrary.library_system.domains.library.Library;
import com.myhomelibrary.library_system.domains.library.LibraryRequest;
import com.myhomelibrary.library_system.exceptions.NotFoundException;
import com.myhomelibrary.library_system.repositories.LibraryRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
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
    public List<Library> getAllLibraries() {
        return libraryRepository.findAll()
                .stream()
                .map(libraryConverter::toLibrary)
                .sorted((l1, l2) -> {
                    int result = l2.updatedAt().compareTo(l1.updatedAt());
                    return result != 0 ? result : l2.createdAt().compareTo(l1.createdAt());
                })
                .toList();
    }

    @Transactional(readOnly = true)
    public List<Library> getLibrariesByUserId(Long userPk) {
        return libraryRepository.findAllByUserId(userPk)
                .stream()
                .map(libraryConverter::toLibrary)
                .sorted((l1, l2) -> {
                    int result = l2.updatedAt().compareTo(l1.updatedAt());
                    return result != 0 ? result : l2.createdAt().compareTo(l1.createdAt());
                })
                .toList();
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
        var entityWithOwner = libraryRepository.findLibraryById(savedLibraryEntity.getId()).orElseThrow();
        return libraryConverter.toLibrary(entityWithOwner);
    }

    @Transactional
    public Library updateLibrary(UUID id, LibraryRequest libraryRequest) {
        var libraryEntity = libraryRepository.findLibraryById(id).orElseThrow(NotFoundException::new);
        libraryConverter.updateLibraryEntity(libraryRequest, libraryEntity);
        var savedLibraryEntity = libraryRepository.save(libraryEntity);
        var entityWithOwner = libraryRepository.findLibraryById(savedLibraryEntity.getId()).orElseThrow();
        return libraryConverter.toLibrary(entityWithOwner);
    }
}
