package com.myhomelibrary.library_system.exceptions;

import com.google.firebase.auth.FirebaseAuthException;

public class FirebaseServiceException extends RuntimeException {

    private final FirebaseAuthException firebaseAuthException;

    public FirebaseServiceException(String message, FirebaseAuthException cause) {
        super(message, cause);
        this.firebaseAuthException = cause;
    }

    public FirebaseAuthException getFirebaseAuthException() {
        return firebaseAuthException;
    }
}
