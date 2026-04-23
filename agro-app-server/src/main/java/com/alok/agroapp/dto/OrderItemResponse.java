package com.alok.agroapp.dto;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItemResponse {

    private String productName;

    private int quantity;

    private BigDecimal price;
}