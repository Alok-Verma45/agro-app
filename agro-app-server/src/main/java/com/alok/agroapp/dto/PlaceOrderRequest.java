package com.alok.agroapp.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PlaceOrderRequest {

    // Delivery
    private String fullName;
    private String phone;
    private String pincode;
    private String city;
    private String state;
    private String addressLine;

    // Payment
    private String paymentMethod;   // COD / UPI
    private String transactionId;   // optional for UPI
}