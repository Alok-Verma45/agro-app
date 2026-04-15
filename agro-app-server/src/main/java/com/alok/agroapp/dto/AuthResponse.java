package com.alok.agroapp.dto;

import lombok.Getter;

@Getter
public class AuthResponse {

    // getters
    private String token;
    private String role;
    private String message;

    // 🔥 LOGIN constructor
    public AuthResponse(String token, String role) {
        this.token = token;
        this.role = role;
    }

    // 🔥 REGISTER constructor
    public AuthResponse(String message) {
        this.message = message;
    }

}