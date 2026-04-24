package com.alok.agroapp.dto;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderResponse {

    private Long id;

    private BigDecimal totalAmount;

    private LocalDateTime createdAt;

    private String status;

    // Customer Details
    private String userName;
    private String email;
    private String phone;

    // Delivery Details
    private String fullName;
    private String pincode;
    private String city;
    private String state;
    private String addressLine;

    // Items
    private List<OrderItemResponse> items;
}