package com.myhomelibrary.library_system.domains.comment;

import com.myhomelibrary.library_system.domains.user.UserShort;
import lombok.Builder;

import java.time.Instant;
import java.util.UUID;

@Builder(toBuilder = true)
public record Comment(
        UUID id,
        String text,
        Integer rating,
        Instant createdAt,
        Instant updatedAt,
        UserShort user
) {
}