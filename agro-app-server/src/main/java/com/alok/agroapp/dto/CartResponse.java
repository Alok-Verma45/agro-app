package com.alok.agroapp.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class CartResponse {
    private Long id;
    private BigDecimal totalAmount;
    private List<CartItemResponse> items;
}