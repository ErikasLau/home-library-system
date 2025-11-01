package com.myhomelibrary.library_system.domains.user;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.myhomelibrary.library_system.domains.enums.UserRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class User {
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private Long pk;
    private String id;
    private String name;
    private String surname;
    private String username;
    private String email;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd", timezone = "UTC")
    private LocalDate dateOfBirth;
    private UserRole role;
}
