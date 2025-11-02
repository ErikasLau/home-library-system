package com.myhomelibrary.library_system.controllers;

import com.myhomelibrary.library_system.domains.api.Response;
import com.myhomelibrary.library_system.domains.user.LoginRequest;
import com.myhomelibrary.library_system.domains.user.LoginResponse;
import com.myhomelibrary.library_system.domains.user.RegistrationRequest;
import com.myhomelibrary.library_system.domains.user.User;
import com.myhomelibrary.library_system.services.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "User registration and login operations")
public class AuthenticationController {

    private final UserService userService;

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Register user", description = "Registers a new user.")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "User registered successfully"),
    })
    public Response<User> register(@RequestBody RegistrationRequest registrationRequest) {
        return Response.success(userService.registerUser(registrationRequest));
    }

    @PostMapping("/login")
    @Operation(summary = "Login user", description = "Authenticates a user with email and password, returns JWT token with custom claims and user data.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "User authenticated successfully")
    })
    public Response<LoginResponse> login(@RequestBody LoginRequest request) {
        LoginResponse loginResponse = userService.authenticateWithEmailAndPassword(
                request.email(),
                request.password()
        );

        return Response.success(loginResponse);
    }

    @GetMapping("/me")
    @Operation(summary = "Get current user", description = "Returns the current authenticated user's information.")
    @SecurityRequirement(name = "bearerAuth")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Current user retrieved successfully"),
            @ApiResponse(responseCode = "401", description = "User not authenticated")
    })
    public Response<User> getCurrentUser() {
        return Response.success(userService.getCurrentUser());
    }
}