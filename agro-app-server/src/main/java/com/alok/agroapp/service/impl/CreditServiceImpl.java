package com.alok.agroapp.service.impl;

import com.alok.agroapp.dto.CustomerPendingResponse;
import com.alok.agroapp.dto.DashboardResponse;
import com.alok.agroapp.entity.Credit;
import com.alok.agroapp.entity.Product;
import com.alok.agroapp.entity.enums.CreditStatus;
import com.alok.agroapp.repository.CreditRepository;
import com.alok.agroapp.repository.CustomerRepository;
import com.alok.agroapp.repository.ProductRepository;
import com.alok.agroapp.service.CreditService;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class CreditServiceImpl implements CreditService {

    private final CreditRepository creditRepository;
    private final CustomerRepository customerRepository;
    private final ProductRepository productRepository;

    public CreditServiceImpl(CreditRepository creditRepository,
                             CustomerRepository customerRepository,
                             ProductRepository productRepository) {
        this.creditRepository = creditRepository;
        this.customerRepository = customerRepository;
        this.productRepository = productRepository;
    }

    @Override
    public Credit createCredit(Long customerId, Credit credit) {

        var customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        Product product = productRepository.findById(credit.getProduct().getId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // ✅ VALIDATION (VERY IMPORTANT)
        if (credit.getQuantity() == null || credit.getQuantity() <= 0) {
            throw new RuntimeException("Invalid quantity");
        }

        if (product.getQuantity() < credit.getQuantity()) {
            throw new RuntimeException("Not enough stock");
        }

        credit.setCustomer(customer);
        credit.setProduct(product);

        // ✅ DEFAULT PAID
        BigDecimal paid = credit.getPaidAmount() == null
                ? BigDecimal.ZERO
                : credit.getPaidAmount();

        credit.setPaidAmount(paid);

        // ✅ TOTAL CALCULATION
        BigDecimal total = product.getPrice()
                .multiply(BigDecimal.valueOf(credit.getQuantity()));

        credit.setTotalAmount(total);

        // ✅ PENDING
        BigDecimal pending = total.subtract(paid);
        credit.setPendingAmount(pending);

        // ✅ STATUS
        credit.setStatus(
                pending.compareTo(BigDecimal.ZERO) == 0
                        ? CreditStatus.PAID
                        : CreditStatus.PENDING
        );

        // ✅ 🔥 STOCK UPDATE (MAIN FIX)
        product.setQuantity(product.getQuantity() - credit.getQuantity());
        productRepository.save(product);

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

        // ✅ SAFE PAID UPDATE
        BigDecimal newPaid = credit.getPaidAmount()
                .add(BigDecimal.valueOf(amount));

        if (newPaid.compareTo(credit.getTotalAmount()) > 0) {
            throw new RuntimeException("Paid amount exceeds total");
        }

        credit.setPaidAmount(newPaid);

        // ✅ RECALCULATE
        BigDecimal pending = credit.getTotalAmount().subtract(newPaid);
        credit.setPendingAmount(pending);

        credit.setStatus(
                pending.compareTo(BigDecimal.ZERO) == 0
                        ? CreditStatus.PAID
                        : CreditStatus.PENDING
        );

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

    @Override
    public List<CustomerPendingResponse> getTopCustomers() {

        List<Object[]> data = creditRepository.getTopCustomersByPending();

        return data.stream()
                .map(obj -> new CustomerPendingResponse(
                        (String) obj[0],
                        ((Number) obj[1]).doubleValue()
                ))
                .toList();
    }
}