package com.alok.agroapp.controller;

import com.alok.agroapp.dto.OrderResponse;
import com.alok.agroapp.entity.enums.OrderStatus;
import com.alok.agroapp.service.OrderService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    // 🔥 Place Order API
    @PostMapping("/place")
    public ResponseEntity<Map<String, String>> placeOrder() {

        orderService.placeOrder();

        return ResponseEntity
                .status(HttpStatus.CREATED) // 201
                .body(Map.of("message", "Order placed successfully"));
    }

    // 🔥 USER → My Orders
    @GetMapping("/my")
    public ResponseEntity<List<OrderResponse>> getMyOrders() {

        List<OrderResponse> orders = orderService.getMyOrders();

        return ResponseEntity.ok(orders); // 200
    }

    // 🔥 ADMIN → All Orders
    @GetMapping("/all")
    public ResponseEntity<List<OrderResponse>> getAllOrders() {

        List<OrderResponse> orders = orderService.getAllOrders();

        return ResponseEntity.ok(orders);
    }

    // 🔥 Order Details
    @GetMapping("/{id:\\d+}")
    public ResponseEntity<OrderResponse> getOrderById(@PathVariable Long id) {

        OrderResponse order = orderService.getOrderById(id);

        return ResponseEntity.ok(order);
    }
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(
            @PathVariable Long id,
            @RequestParam OrderStatus status) {

        orderService.updateOrderStatus(id, status);
        return ResponseEntity.ok(Map.of("message", "Status updated"));
    }
}