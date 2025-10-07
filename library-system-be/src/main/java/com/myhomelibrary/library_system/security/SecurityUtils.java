package com.myhomelibrary.library_system.security;

import com.myhomelibrary.library_system.domains.user.AuthenticatedUser;
import com.myhomelibrary.library_system.exceptions.UnauthorizedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;

public class SecurityUtils {
    public static AuthenticatedUser getAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof AuthenticatedUser)) {
            throw new UnauthorizedException();
        }
        return (AuthenticatedUser) authentication.getPrincipal();
    }

    public static Long getAuthenticatedUserPk() {
        return getAuthenticatedUser().pk();
    }

    public static boolean isCurrentUserAdmin() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) return false;
        return authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch(auth -> auth.equals("ROLE_ADMIN") || auth.equals("ADMIN"));
    }
}
