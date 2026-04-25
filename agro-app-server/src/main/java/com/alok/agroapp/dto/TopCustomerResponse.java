package com.alok.agroapp.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TopCustomerResponse {

    private String customerName;
    private Double pendingAmount;
}