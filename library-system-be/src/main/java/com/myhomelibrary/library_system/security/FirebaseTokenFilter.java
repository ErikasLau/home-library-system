package com.myhomelibrary.library_system.security;


import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import com.myhomelibrary.library_system.domains.firebase.FirebaseSignInResponse;
import com.myhomelibrary.library_system.domains.firebase.UserCustomClaims;
import com.myhomelibrary.library_system.domains.user.AuthenticatedUser;
import com.myhomelibrary.library_system.exceptions.UnauthorizedException;
import com.myhomelibrary.library_system.services.FirebaseAuthService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
@AllArgsConstructor
public class FirebaseTokenFilter extends OncePerRequestFilter {
    private final FirebaseAuth firebaseAuth;
    private final FirebaseAuthService firebaseAuthService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String authHeader = request.getHeader("Authorization");
        if (!isBearerToken(authHeader)) {
            filterChain.doFilter(request, response);
            return;
        }

        String customToken = extractToken(authHeader);
        try {
            FirebaseSignInResponse signInResponse = firebaseAuthService.signInWithCustomToken(customToken);
            FirebaseToken firebaseToken = verifyToken(signInResponse.idToken());
            UserCustomClaims customClaims = UserCustomClaims.fromMap(firebaseToken.getClaims());
            validateClaims(customClaims);
            setAuthentication(customClaims, firebaseToken);
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }
        filterChain.doFilter(request, response);
    }

    private boolean isBearerToken(String authHeader) {
        return authHeader != null && authHeader.startsWith("Bearer ");
    }

    private String extractToken(String authHeader) {
        return authHeader.substring(7);
    }

    private FirebaseToken verifyToken(String idToken) throws FirebaseAuthException {
        return firebaseAuth.verifyIdToken(idToken);
    }

    private void validateClaims(UserCustomClaims claims) {
        if (claims.userId() == null || claims.role() == null) {
            throw new UnauthorizedException();
        }
    }

    private void setAuthentication(UserCustomClaims claims, FirebaseToken firebaseToken) {
        SimpleGrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + claims.role().toUpperCase());
        AuthenticatedUser authenticatedUser = new AuthenticatedUser(claims.userPk(), firebaseToken.getUid());
        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                authenticatedUser,
                null,
                Collections.singletonList(authority)
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
    }
}
