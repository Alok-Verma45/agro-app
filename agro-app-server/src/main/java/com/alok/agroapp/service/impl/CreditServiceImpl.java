package com.alok.agroapp.service.impl;

import com.alok.agroapp.dto.CustomerPendingResponse;
import com.alok.agroapp.dto.DashboardResponse;
import com.alok.agroapp.entity.Credit;
import com.alok.agroapp.repository.CreditRepository;
import com.alok.agroapp.repository.CustomerRepository;
import com.alok.agroapp.service.CreditService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CreditServiceImpl implements CreditService {

    private final CreditRepository creditRepository;
    private final CustomerRepository customerRepository;

    public CreditServiceImpl(CreditRepository creditRepository,
                             CustomerRepository customerRepository) {
        this.creditRepository = creditRepository;
        this.customerRepository = customerRepository;
    }

    @Override
    public Credit createCredit(Long customerId, Credit credit) {

        var customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        credit.setCustomer(customer);

        // calculation
        credit.setPendingAmount(
                credit.getTotalAmount().subtract(credit.getPaidAmount())
        );

        return creditRepository.save(credit);
    }

    @Override
    public List<Credit> getAllCredits() {
        return creditRepository.findAll();
    }

    @Override
    public List<Credit> getCreditsByCustomer(Long customerId) {
        return creditRepository.findByCustomerId(customerId);
    }

    @Override
    public Credit addPayment(Long creditId, Double amount) {

        Credit credit = creditRepository.findById(creditId)
                .orElseThrow(() -> new RuntimeException("Credit not found"));

        // update paid amount
        credit.setPaidAmount(
                credit.getPaidAmount().add(java.math.BigDecimal.valueOf(amount))
        );

        // recalculate pending
        credit.setPendingAmount(
                credit.getTotalAmount().subtract(credit.getPaidAmount())
        );

        // update status
        if (credit.getPendingAmount().compareTo(java.math.BigDecimal.ZERO) == 0) {
            credit.setStatus(com.alok.agroapp.entity.enums.CreditStatus.PAID);
        } else {
            credit.setStatus(com.alok.agroapp.entity.enums.CreditStatus.PENDING);
        }

        return creditRepository.save(credit);
    }

    @Override
    public DashboardResponse getDashboardData() {

        Double totalCredit = creditRepository.getTotalCreditAmount();
        Double totalPaid = creditRepository.getTotalPaidAmount();
        Double totalPending = creditRepository.getTotalPendingAmount();

        return DashboardResponse.builder()
                .totalCredit(totalCredit)
                .totalPaid(totalPaid)
                .totalPending(totalPending)
                .build();
    }

    @Override
    public List<CustomerPendingResponse> getCustomerPending() {

        List<Object[]> data = creditRepository.getCustomerWisePending();

        return data.stream()
                .map(obj -> new CustomerPendingResponse(
                        (String) obj[0],
                        ((Number) obj[1]).doubleValue()
                ))
                .toList();
    }
}
