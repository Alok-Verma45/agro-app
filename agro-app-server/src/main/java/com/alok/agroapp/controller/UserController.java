package com.alok.agroapp.controller;

import com.alok.agroapp.dto.UserResponse;
import com.alok.agroapp.entity.User;
import com.alok.agroapp.service.UserService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    public UserResponse getProfile(Authentication authentication) {
        String email = authentication.getName();
        return userService.getByEmail(email);
    }

    @PutMapping("/me")
    public UserResponse updateProfile(
            Authentication authentication,
            @RequestBody User updatedUser
    ) {
        String email = authentication.getName();
        return userService.updateProfile(email, updatedUser);
    }
}