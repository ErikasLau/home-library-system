package com.myhomelibrary.library_system.domains.enums;

public enum UserRole {
    MEMBER,
    MODERATOR,
    ADMIN;

    public static final UserRole DEFAULT = MEMBER;

    public static UserRole fromString(String role) {
        if (role == null) return DEFAULT;
        try {
            return UserRole.valueOf(role);
        } catch (IllegalArgumentException e) {
            return DEFAULT;
        }
    }
}
