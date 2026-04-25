package com.alok.agroapp.service.impl;

import com.alok.agroapp.dto.CustomerPendingResponse;
import com.alok.agroapp.dto.DashboardResponse;
import com.alok.agroapp.dto.OfflineDashboardResponse;
import com.alok.agroapp.dto.TopCustomerResponse;
import com.alok.agroapp.service.CreditService;
import com.alok.agroapp.service.CustomerService;
import com.alok.agroapp.service.OfflineDashboardService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OfflineDashboardServiceImpl
        implements OfflineDashboardService {

    private final CustomerService customerService;
    private final CreditService creditService;

    public OfflineDashboardServiceImpl(
            CustomerService customerService,
            CreditService creditService
    ) {
        this.customerService = customerService;
        this.creditService = creditService;
    }

    @Override
    public OfflineDashboardResponse getOfflineDashboard() {

        DashboardResponse dashboard =
                creditService.getDashboardData();

        List<TopCustomerResponse> topCustomers =
                creditService.getTopCustomers()
                        .stream()
                        .map(item -> TopCustomerResponse.builder()
                                .customerName(item.getCustomerName())
                                .pendingAmount(item.getPendingAmount())
                                .build())
                        .toList();

        List<CustomerPendingResponse> pendingCustomers =
                creditService.getCustomerPending()
                        .stream()
                        .map(item -> CustomerPendingResponse.builder()
                                .customerName(item.getCustomerName())
                                .pendingAmount(item.getPendingAmount())
                                .build())
                        .toList();

        return OfflineDashboardResponse.builder()
                .totalCustomers(
                        (long) customerService.getAllCustomers().size()
                )
                .totalCredit(dashboard.getTotalCredit())
                .totalPaid(dashboard.getTotalPaid())
                .totalPending(dashboard.getTotalPending())
                .topCustomers(topCustomers)
                .pendingCustomers(pendingCustomers)
                .build();
    }
}