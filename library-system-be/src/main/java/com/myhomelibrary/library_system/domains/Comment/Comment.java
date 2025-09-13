package com.myhomelibrary.library_system.domains.Comment;

import com.myhomelibrary.library_system.domains.User.UserShort;
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