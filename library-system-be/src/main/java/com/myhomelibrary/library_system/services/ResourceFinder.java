package com.myhomelibrary.library_system.services;

import java.util.Optional;
import java.util.UUID;

@FunctionalInterface
public interface ResourceFinder<T> {
    Optional<T> find(UUID id);
}

