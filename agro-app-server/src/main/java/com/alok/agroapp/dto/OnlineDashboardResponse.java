package com.alok.agroapp.dto;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OnlineDashboardResponse {

    private Long totalUsers;
    private Long totalOrders;
    private Long totalProducts;

    private BigDecimal totalRevenue;

    private Long placedOrders;
    private Long confirmedOrders;
    private Long shippedOrders;
    private Long deliveredOrders;
    private Long cancelledOrders;
}