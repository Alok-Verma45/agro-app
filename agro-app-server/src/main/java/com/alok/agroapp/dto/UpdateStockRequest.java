package com.alok.agroapp.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateStockRequest {

    private Integer quantity;
}