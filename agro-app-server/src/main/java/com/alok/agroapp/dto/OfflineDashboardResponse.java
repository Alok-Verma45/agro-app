package com.alok.agroapp.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OfflineDashboardResponse {

    private Long totalCustomers;

    private Double totalCredit;
    private Double totalPaid;
    private Double totalPending;

    private List<TopCustomerResponse> topCustomers;

    private List<CustomerPendingResponse> pendingCustomers;
}