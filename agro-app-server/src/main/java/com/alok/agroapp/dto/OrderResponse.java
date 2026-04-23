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

    private List<OrderItemResponse> items;
}