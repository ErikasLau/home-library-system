package com.myhomelibrary.library_system.exceptions;

import java.io.Serial;

public class InvalidCredentialsException extends AuthenticationException {
    @Serial
    private static final long serialVersionUID = 583205238689282550L;

    public InvalidCredentialsException(String message) {
        super(message);
    }
}
