package com.myhomelibrary.library_system.domains.firebase;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public record FirebaseSignInResponse(
        @JsonProperty("idToken")
        String idToken,

        @JsonProperty("email")
        String email,

        @JsonProperty("refreshToken")
        String refreshToken,

        @JsonProperty("expiresIn")
        String expiresIn,

        @JsonProperty("localId")
        String localId,

        @JsonProperty("registered")
        boolean registered
) {
}
