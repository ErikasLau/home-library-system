package com.myhomelibrary.library_system.domains.user;

import lombok.Builder;

@Builder(toBuilder = true)
public record UserShort(
        String id,
        String username
) {
}
