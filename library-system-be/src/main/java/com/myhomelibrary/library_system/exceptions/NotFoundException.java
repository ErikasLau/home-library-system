package com.myhomelibrary.library_system.exceptions;

import lombok.NoArgsConstructor;

import java.io.Serial;

@NoArgsConstructor
public class NotFoundException extends RuntimeException {
    @Serial
    private static final long serialVersionUID = 1615621653362366949L;

    public NotFoundException(String message) {
        super(message);
    }
}
