package com.myhomelibrary.library_system.exceptions;

import lombok.NoArgsConstructor;

import java.io.Serial;

@NoArgsConstructor
public class ForbiddenException extends RuntimeException {
    @Serial
    private static final long serialVersionUID = 1033163120723748594L;
}
