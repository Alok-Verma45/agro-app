package com.alok.agroapp.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Builder
public class OrderResponse {

    private Long id;

    private BigDecimal totalAmount;

    private LocalDateTime createdAt;

    private String status;

    // Customer
    private String userName;
    private String email;
    private String phone;

    // Delivery
    private String fullName;
    private String pincode;
    private String city;
    private String state;
    private String addressLine;

    // Payment
    private String paymentMethod;
    private String paymentStatus;
    private String transactionId;
    private LocalDateTime paidAt;
    private LocalDateTime deliveredAt;

    // Items
    private List<OrderItemResponse> items;
}