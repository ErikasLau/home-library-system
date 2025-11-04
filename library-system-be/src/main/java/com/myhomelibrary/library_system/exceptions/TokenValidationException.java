package com.myhomelibrary.library_system.exceptions;

import java.io.Serial;

public class TokenValidationException extends AuthenticationException {
    @Serial
    private static final long serialVersionUID = 5101471903209480672L;

    public TokenValidationException(String message) {
        super(message);
    }
}
