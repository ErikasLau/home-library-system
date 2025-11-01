package com.myhomelibrary.library_system.domains.firebase;

import com.fasterxml.jackson.annotation.JsonProperty;

public record FirebaseErrorResponse(
        @JsonProperty("error")
        FirebaseError error
) {
    public record FirebaseError(
            @JsonProperty("code")
            int code,
            @JsonProperty("message")
            String message,
            @JsonProperty("status")
            String status
    ) {
    }
}

