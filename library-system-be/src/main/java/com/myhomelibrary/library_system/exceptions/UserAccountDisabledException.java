package com.myhomelibrary.library_system.exceptions;

import java.io.Serial;

public class UserAccountDisabledException extends AuthenticationException {
    @Serial
    private static final long serialVersionUID = -2564784426522352657L;

    public UserAccountDisabledException(String message) {
        super(message);
    }
}
