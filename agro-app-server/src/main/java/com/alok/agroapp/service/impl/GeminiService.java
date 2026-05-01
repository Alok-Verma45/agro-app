package com.alok.agroapp.service.impl;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class GeminiService {

    @Value("${gemini.api.key}")
    private String apiKey;

    private final String URL =
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=";

    public String getResponse(String userInput) {

        RestTemplate restTemplate = new RestTemplate();

        String finalPrompt =
                "You are an agriculture expert. Answer in simple Hindi.\n\nUser: " + userInput;

        Map<String, Object> textPart = Map.of("text", finalPrompt);
        Map<String, Object> part = Map.of("parts", List.of(textPart));
        Map<String, Object> body = Map.of("contents", List.of(part));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> request =
                new HttpEntity<>(body, headers);

        ResponseEntity<Map> response =
                restTemplate.postForEntity(URL + apiKey, request, Map.class);

        Map<String, Object> responseBody = response.getBody();

        if (responseBody == null) {
            return "No response from AI";
        }

        List<Map<String, Object>> candidates =
                (List<Map<String, Object>>) responseBody.get("candidates");

        if (candidates == null || candidates.isEmpty()) {
            return "No candidates found";
        }

        Map<String, Object> first = candidates.get(0);

        Map<String, Object> content =
                (Map<String, Object>) first.get("content");

        List<Map<String, Object>> parts =
                (List<Map<String, Object>>) content.get("parts");

        Map<String, Object> textMap = parts.get(0);

        return textMap.get("text").toString();
    }
}