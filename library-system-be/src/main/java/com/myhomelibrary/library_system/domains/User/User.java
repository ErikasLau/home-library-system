package com.myhomelibrary.library_system.domains.User;

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
    private String id;
    private String name;
    private String surname;
    private String username;
    private String email;
    private LocalDate dateOfBirth;
    private UserRole role;
}
