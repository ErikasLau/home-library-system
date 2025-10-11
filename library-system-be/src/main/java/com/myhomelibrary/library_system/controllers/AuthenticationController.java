package com.myhomelibrary.library_system.controllers;

import com.myhomelibrary.library_system.domains.api.Response;
import com.myhomelibrary.library_system.domains.user.FirebaseLoginRequest;
import com.myhomelibrary.library_system.domains.user.RegistrationRequest;
import com.myhomelibrary.library_system.domains.user.User;
import com.myhomelibrary.library_system.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final UserService userService;

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public Response<User> register(@RequestBody RegistrationRequest registrationRequest) {
        return Response.success(userService.registerUser(registrationRequest));
    }

    @PostMapping("/login")
    public Response<String> login(@RequestBody FirebaseLoginRequest request) {
        User user = userService.getUserByToken(request.idToken());
        return Response.success(request.idToken());
    }
}
