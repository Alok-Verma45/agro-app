package com.alok.agroapp.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CustomerPendingResponse {

    private String customerName;
    private Double pendingAmount;
}