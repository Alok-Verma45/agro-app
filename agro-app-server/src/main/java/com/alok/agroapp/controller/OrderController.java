package com.alok.agroapp.controller;

import com.alok.agroapp.dto.OrderResponse;
import com.alok.agroapp.dto.PlaceOrderRequest;
import com.alok.agroapp.entity.enums.OrderStatus;
import com.alok.agroapp.service.OrderService;
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

    // =====================================
    // PLACE ORDER
    // =====================================
    @PostMapping("/place")
    public ResponseEntity<?> placeOrder(
            @RequestBody PlaceOrderRequest request
    ) {
        orderService.placeOrder(request);

        return ResponseEntity.ok(
                Map.of("message", "Order placed")
        );
    }

    // =====================================
    // USER ORDERS
    // =====================================
    @GetMapping("/my")
    public ResponseEntity<List<OrderResponse>> getMyOrders() {

        return ResponseEntity.ok(
                orderService.getMyOrders()
        );
    }

    // =====================================
    // ADMIN ALL ORDERS
    // =====================================
    @GetMapping("/all")
    public ResponseEntity<List<OrderResponse>> getAllOrders() {

        return ResponseEntity.ok(
                orderService.getAllOrders()
        );
    }

    // =====================================
    // ORDER DETAILS
    // =====================================
    @GetMapping("/{id:\\d+}")
    public ResponseEntity<OrderResponse> getOrderById(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(
                orderService.getOrderById(id)
        );
    }

    // =====================================
    // ADMIN UPDATE ORDER STATUS
    // =====================================
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(
            @PathVariable Long id,
            @RequestParam OrderStatus status
    ) {
        orderService.updateOrderStatus(id, status);

        return ResponseEntity.ok(
                Map.of("message", "Order status updated")
        );
    }

    // =====================================
    // USER CANCEL ORDER
    // =====================================
    @PutMapping("/{id}/cancel")
    public ResponseEntity<?> cancelMyOrder(
            @PathVariable Long id
    ) {
        orderService.cancelMyOrder(id);

        return ResponseEntity.ok(
                Map.of("message", "Order cancelled")
        );
    }

    // =====================================
    // ADMIN VERIFY PAYMENT
    // =====================================
    @PutMapping("/{id}/payment/verify")
    public ResponseEntity<?> verifyPayment(
            @PathVariable Long id
    ) {
        orderService.verifyPayment(id);

        return ResponseEntity.ok(
                Map.of("message", "Payment verified")
        );
    }

    // =====================================
    // ADMIN REJECT PAYMENT
    // =====================================
    @PutMapping("/{id}/payment/reject")
    public ResponseEntity<?> rejectPayment(
            @PathVariable Long id
    ) {
        orderService.rejectPayment(id);

        return ResponseEntity.ok(
                Map.of("message", "Payment rejected")
        );
    }
}