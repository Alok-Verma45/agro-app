package com.alok.agroapp.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PlaceOrderRequest {

    private String fullName;
    private String phone;
    private String pincode;
    private String city;
    private String state;
    private String addressLine;
}