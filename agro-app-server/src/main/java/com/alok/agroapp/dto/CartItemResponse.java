package com.alok.agroapp.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@AllArgsConstructor
public class CartItemResponse {

    private Long itemId;   // 🔥 ADD THIS
    private String productName;
    private int quantity;
    private BigDecimal priceAtTime;
}