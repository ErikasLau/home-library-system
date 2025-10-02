package com.myhomelibrary.library_system.domains.User;

import lombok.Builder;

@Builder(toBuilder = true)
public record UserShort(
        String id,
        String username
) {
}
