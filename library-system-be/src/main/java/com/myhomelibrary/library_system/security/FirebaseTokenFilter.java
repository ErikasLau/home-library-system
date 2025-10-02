package com.myhomelibrary.library_system.security;


import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import com.myhomelibrary.library_system.entities.UserEntity;
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

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String authToken = request.getHeader("Authorization");
        if (authToken == null || !authToken.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String idToken = authToken.substring(7);

        try {
            FirebaseToken firebaseToken = FirebaseAuth.getInstance().verifyIdToken(idToken);
            String firebaseUid = firebaseToken.getUid();
            String email = firebaseToken.getEmail();
            String usernameFromEmail = email.substring(0, email.indexOf("@"));
            String username = usernameFromEmail.length() > 16 ? usernameFromEmail.substring(0, 16) : usernameFromEmail;

            //TODO: unauthorized
            UserEntity appUser = userRepository.findUserById(firebaseUid).orElseThrow(() -> new RuntimeException("User not found in the database"));

//            UserEntity appUser = userRepository.findUserById(firebaseUid).orElseGet(() -> {
//                UserEntity newUser = User.builder()
//                        .id(firebaseUid)
//                        .email(email)
//                        .username(username)
//                        .role(UserRole.USER)
//                        .build();
//
//                return userRepository.save(newUser);
//            });

            SimpleGrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + appUser.getRole().name());

            UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                    appUser.getId(),
                    null,
                    Collections.singletonList(authority)
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);
        } catch (FirebaseAuthException e) {
            logger.warn("Firebase token validation failed: " + e.getMessage());
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        } catch (Exception e) {
            logger.error("Error processing Firebase token: " + e.getMessage(), e);
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            return;
        }

        filterChain.doFilter(request, response);
    }
}
