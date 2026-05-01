package com.alok.agroapp.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminUserResponse {

    private Long id;
    private String name;
    private String email;
    private String phone;
    private String role;

    private boolean blocked;
    private LocalDateTime createdAt;

    private int totalOrders;
    private double totalSpent;
}