package com.myhomelibrary.library_system.domains.library;

import com.myhomelibrary.library_system.domains.enums.LibraryPrivacyStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class LibraryRequest {

    @NotBlank(message = "Title cannot be blank")
    @Size(min = 3, max = 255, message = "Title must be between 3 and 255 characters")
    private String title;

    @Size(max = 2000, message = "Description cannot exceed 2000 characters")
    private String description;

    @Pattern(regexp = "^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$", message = "Color must be a valid hex code (e.g., #FFFFFF)")
    private String color;

    @NotNull(message = "Privacy status cannot be null")
    private LibraryPrivacyStatus privacyStatus;

    private boolean isEditable;
}
