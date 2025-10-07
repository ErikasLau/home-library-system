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

    @Transactional(readOnly = true)
    public Library getLibraryById(UUID id) {
        return LibraryConverter.toLibrary(libraryRepository.findLibraryById(id).orElseThrow(NotFoundException::new));
    }

    @Transactional(readOnly = true)
    public Page<Library> getAllLibraries(Pageable pageable) {
        return libraryRepository.findAll(pageable)
                .map(LibraryConverter::toLibrary);
    }

    @Transactional(readOnly = true)
    public Page<Library> getLibrariesByUserId(Pageable pageable, Long userPk) {
        return libraryRepository.findAllByUserId(userPk, pageable)
                .map(LibraryConverter::toLibrary);
    }

    @Transactional
    public UUID deleteLibraryById(UUID id) {
        var library = libraryRepository.findLibraryById(id).orElseThrow(NotFoundException::new);
        libraryRepository.deleteById(library.getPk());
        return library.getId();
    }

    @Transactional
    public Library createLibrary(LibraryRequest libraryRequest, Long userId) {
        var libraryEntity = LibraryConverter.toLibraryEntity(libraryRequest, userId);
        var savedLibraryEntity = libraryRepository.save(libraryEntity);
        return LibraryConverter.toLibrary(savedLibraryEntity);
    }

    @Transactional
    public Library updateLibrary(UUID id, LibraryRequest libraryRequest) {
        var libraryEntity = libraryRepository.findLibraryById(id).orElseThrow(NotFoundException::new);

        libraryEntity.setTitle(libraryRequest.getTitle());
        libraryEntity.setDescription(libraryRequest.getDescription());
        libraryEntity.setColor(libraryRequest.getColor());
        libraryEntity.setPrivacyStatus(libraryRequest.getPrivacyStatus());
        libraryEntity.setEditable(libraryRequest.isEditable());

        var savedLibraryEntity = libraryRepository.save(libraryEntity);
        return LibraryConverter.toLibrary(savedLibraryEntity);
    }
}
