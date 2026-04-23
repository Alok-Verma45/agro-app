package com.alok.agroapp.controller;

import com.alok.agroapp.dto.OrderResponse;
import com.alok.agroapp.entity.Order;
import com.alok.agroapp.service.OrderService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    @GetMapping("/my")
    public List<OrderResponse> getMyOrders() {
        return orderService.getMyOrders();
    }

    @GetMapping("/all")
    public List<OrderResponse> getAllOrders() {
        return orderService.getAllOrders();
    }

    @GetMapping("/{id:\\d+}")
    public OrderResponse getOrderById(@PathVariable Long id) {
        return orderService.getOrderById(id);
    }
}