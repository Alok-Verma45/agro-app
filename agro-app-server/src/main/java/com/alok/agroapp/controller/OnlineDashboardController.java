package com.alok.agroapp.controller;

import com.alok.agroapp.dto.OnlineDashboardResponse;
import com.alok.agroapp.service.OnlineDashboardService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class OnlineDashboardController {

    private final OnlineDashboardService onlineDashboardService;

    public OnlineDashboardController(
            OnlineDashboardService onlineDashboardService
    ) {
        this.onlineDashboardService = onlineDashboardService;
    }

    @GetMapping("/online")
    public OnlineDashboardResponse getOnlineDashboard() {
        return onlineDashboardService.getOnlineDashboard();
    }
}