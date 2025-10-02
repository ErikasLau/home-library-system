package com.myhomelibrary.library_system.security;


import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import com.myhomelibrary.library_system.domains.User.AuthenticatedUser;
import com.myhomelibrary.library_system.entities.UserEntity;
import com.myhomelibrary.library_system.exceptions.NotFoundException;
import com.myhomelibrary.library_system.exceptions.UnauthorizedException;
import com.myhomelibrary.library_system.repositories.UserRepository;
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
    private final UserRepository userRepository;
    private final FirebaseAuth firebaseAuth;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String authToken = request.getHeader("Authorization");
        if (authToken == null || !authToken.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String idToken = authToken.substring(7);

        try {
            verifyToken(idToken);
            FirebaseToken firebaseToken = verifyToken(idToken);
            String firebaseUid = firebaseToken.getUid();

            UserEntity appUser = userRepository.findUserById(firebaseUid)
                    .orElseThrow(() -> new NotFoundException("User not found in the database"));
            SimpleGrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + appUser.getRole().name().toUpperCase());

            AuthenticatedUser authenticatedUser = new AuthenticatedUser(appUser.getPk(), firebaseUid);
            UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                    authenticatedUser,
                    null,
                    Collections.singletonList(authority)
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);
        } catch (FirebaseAuthException e) {
            throw new UnauthorizedException();
        }


        filterChain.doFilter(request, response);
    }

    private FirebaseToken verifyToken(String idToken) throws FirebaseAuthException {
        return firebaseAuth.verifyIdToken(idToken);
    }
}
