package com.alok.agroapp.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class PaymentOrderResponse {

    private String orderId;
    private Long amount;
    private String currency;
    private String key;
}