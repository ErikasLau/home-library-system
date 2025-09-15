package com.myhomelibrary.library_system.controllers;

import com.myhomelibrary.library_system.services.CommentService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import static com.myhomelibrary.library_system.controllers.CommentController.COMMENT_BASE_URL;

@RestController
@RequestMapping(COMMENT_BASE_URL)
@AllArgsConstructor
public class CommentController {
    public static final String COMMENT_BASE_URL = "/v1/comment";

    private final CommentService commentService;

    @GetMapping
    public String getLibraries() {
        return "Hello from CommentController";
    }

    @GetMapping
    public String getLibraryById() {
        return "Hello from CommentController";
    }

    @PostMapping
    public String createLibrary() {
        return "Hello from CommentController";
    }

    @DeleteMapping
    public String deleteLibrary() {
        return "Hello from CommentController";
    }

    @PutMapping
    public String updateLibrary() {
        return "Hello from CommentController";
    }
}
