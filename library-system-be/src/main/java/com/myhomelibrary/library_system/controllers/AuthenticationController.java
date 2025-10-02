package com.myhomelibrary.library_system.controllers;

import com.myhomelibrary.library_system.domains.Api.Response;
import com.myhomelibrary.library_system.domains.User.RegistrationRequest;
import com.myhomelibrary.library_system.domains.User.User;
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
}
