package com.myhomelibrary.library_system.exceptions;

import lombok.NoArgsConstructor;

import java.io.Serial;

@NoArgsConstructor
public class ResourceAlreadyExistsException extends RuntimeException {
    @Serial
    private static final long serialVersionUID = -7239919158243745523L;

    public ResourceAlreadyExistsException(String message) {
        super(message);
    }
}

