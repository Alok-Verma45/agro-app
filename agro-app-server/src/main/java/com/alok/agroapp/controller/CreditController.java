package com.alok.agroapp.controller;

import com.alok.agroapp.entity.Credit;
import com.alok.agroapp.service.CreditService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/credits")
public class CreditController {

    private final CreditService creditService;

    public CreditController(CreditService creditService) {
        this.creditService = creditService;
    }

    // ➕ Create Credit (customerId required)
    @PostMapping("/{customerId}")
    public Credit createCredit(@PathVariable Long customerId,
                               @RequestBody Credit credit) {
        return creditService.createCredit(customerId, credit);
    }

    // 📦 Get all credits
    @GetMapping
    public List<Credit> getAllCredits() {
        return creditService.getAllCredits();
    }

    // 📦 Get credits by customer
    @GetMapping("/customer/{customerId}")
    public List<Credit> getCreditsByCustomer(@PathVariable Long customerId) {
        return creditService.getCreditsByCustomer(customerId);
    }

    // 💰 Add payment
    @PostMapping("/{creditId}/pay")
    public Credit addPayment(@PathVariable Long creditId,
                             @RequestParam Double amount) {
        return creditService.addPayment(creditId, amount);
    }
}