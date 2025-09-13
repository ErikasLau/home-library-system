package com.myhomelibrary.library_system.domains.User;

import lombok.Builder;

import java.util.UUID;

@Builder(toBuilder = true)
public record UserShort(
        UUID id,
        String username
) {
}
