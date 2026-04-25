package com.alok.agroapp.controller;

import com.alok.agroapp.dto.OfflineDashboardResponse;
import com.alok.agroapp.service.OfflineDashboardService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class OfflineDashboardController {

    private final OfflineDashboardService offlineDashboardService;

    public OfflineDashboardController(
            OfflineDashboardService offlineDashboardService
    ) {
        this.offlineDashboardService =
                offlineDashboardService;
    }

    @GetMapping("/offline")
    public OfflineDashboardResponse getOfflineDashboard() {
        return offlineDashboardService
                .getOfflineDashboard();
    }
}