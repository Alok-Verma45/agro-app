package com.alok.agroapp.controller;

import com.alok.agroapp.dto.PaymentVerifyRequest;
import com.alok.agroapp.service.PaymentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(@RequestBody Map<String, Object> request) throws Exception {

        Number amount = (Number) request.get("amount");

        return ResponseEntity.ok(
                paymentService.createOrder(amount.longValue())
        );
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyPayment(
            @RequestBody PaymentVerifyRequest request
    ) throws Exception {

        return ResponseEntity.ok(
                paymentService.verifyPayment(request)
        );
    }
}