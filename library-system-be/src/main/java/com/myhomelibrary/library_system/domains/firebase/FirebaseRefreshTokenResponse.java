package com.myhomelibrary.library_system.domains.firebase;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public record FirebaseRefreshTokenResponse(
        @JsonProperty("access_token")
        String accessToken,

        @JsonProperty("expires_in")
        String expiresIn,

        @JsonProperty("token_type")
        String tokenType,

        @JsonProperty("refresh_token")
        String refreshToken,

        @JsonProperty("id_token")
        String idToken,

        @JsonProperty("user_id")
        String userId,

        @JsonProperty("project_id")
        String projectId
) {
}
