package com.myhomelibrary.library_system.domains.firebase;

public record FirebaseSignInRequest(
        String email,
        String password,
        boolean returnSecureToken
) {
    public FirebaseSignInRequest(String email, String password) {
        this(email, password, true);
    }
}


