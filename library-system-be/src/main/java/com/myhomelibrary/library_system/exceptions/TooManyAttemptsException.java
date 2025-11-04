package com.myhomelibrary.library_system.exceptions;

import java.io.Serial;

public class TooManyAttemptsException extends AuthenticationException {
    @Serial
    private static final long serialVersionUID = -5443520972235056800L;

    public TooManyAttemptsException(String message) {
        super(message);
    }
}
