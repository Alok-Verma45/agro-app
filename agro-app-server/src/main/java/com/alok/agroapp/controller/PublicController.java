package com.alok.agroapp.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class PublicController {

    @GetMapping("/")
    public String home() {
        return "Agro Backend Live 🚀";
    }

    @GetMapping("/health")
    public String health() {
        return "OK";
    }
}