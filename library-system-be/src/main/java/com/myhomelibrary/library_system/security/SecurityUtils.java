package com.myhomelibrary.library_system.security;

import com.myhomelibrary.library_system.domains.User.AuthenticatedUser;
import com.myhomelibrary.library_system.exceptions.UnauthorizedException;
import org.springframework.security.core.Authentication;
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
}

