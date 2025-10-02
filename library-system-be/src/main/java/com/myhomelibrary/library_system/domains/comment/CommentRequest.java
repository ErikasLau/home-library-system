package com.myhomelibrary.library_system.domains.comment;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.UUID;

@Data
public class CommentRequest {
    @NotBlank(message = "Book ID cannot be blank")
    private UUID bookId;

    @NotBlank(message = "Comment text cannot be blank")
    @Size(max = 1000, message = "Comment text cannot exceed 1000 characters")
    private String text;

    @Min(value = 1, message = "Rating must be at least 1")
    @Max(value = 5, message = "Rating cannot exceed 5")
    private Integer rating;
}
