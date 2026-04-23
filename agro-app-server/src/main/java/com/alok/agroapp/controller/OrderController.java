package com.alok.agroapp.controller;

import com.alok.agroapp.service.OrderService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    // 🔥 Place Order API
    @PostMapping("/place")
    public String placeOrder() {
        orderService.placeOrder();
        return "Order placed successfully";
    }
}