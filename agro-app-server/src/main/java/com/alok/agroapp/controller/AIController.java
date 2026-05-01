package com.alok.agroapp.controller;

import com.alok.agroapp.service.impl.GeminiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin
public class AIController {

    @Autowired
    private GeminiService geminiService;

    @PostMapping("/chat")
    public ResponseEntity<String> chat(@RequestBody Map<String, String> req) {

        String prompt = req.get("prompt");

        String response = geminiService.getResponse(prompt);

        return ResponseEntity.ok(response);
    }
}