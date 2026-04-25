package com.alok.agroapp.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardResponse {

    private Double totalCredit;
    private Double totalPaid;
    private Double totalPending;
}