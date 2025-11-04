package com.myhomelibrary.library_system.exceptions;

import java.io.Serial;

public class UserRegistrationException extends RuntimeException {
    @Serial
    private static final long serialVersionUID = 2017650891843425636L;

    public UserRegistrationException(String message) {
        super(message);
    }
}
