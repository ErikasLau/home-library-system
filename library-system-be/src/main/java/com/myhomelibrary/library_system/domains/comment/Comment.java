package com.myhomelibrary.library_system.domains.comment;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.myhomelibrary.library_system.domains.user.UserShort;
import lombok.Builder;

import java.time.Instant;
import java.util.UUID;

@Builder(toBuilder = true)
public record Comment(
        UUID id,
        String text,
        Integer rating,
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSX", timezone = "UTC")
        Instant createdAt,
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSX", timezone = "UTC")
        Instant updatedAt,
        UserShort user
) {
}