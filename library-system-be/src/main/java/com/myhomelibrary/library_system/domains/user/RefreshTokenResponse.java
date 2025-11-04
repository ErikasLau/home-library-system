package com.myhomelibrary.library_system.domains.user;

public record RefreshTokenResponse(
        String accessToken,
        String refreshToken,
        String expiresIn
) {
}
