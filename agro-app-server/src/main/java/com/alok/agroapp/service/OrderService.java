package com.alok.agroapp.service;

import com.alok.agroapp.dto.OrderResponse;
import com.alok.agroapp.dto.PlaceOrderRequest;
import com.alok.agroapp.entity.enums.OrderStatus;

import java.util.List;

public interface OrderService {
    void placeOrder(PlaceOrderRequest request);

    List<OrderResponse> getMyOrders();
    List<OrderResponse> getAllOrders();
    OrderResponse getOrderById(Long id);
    void updateOrderStatus(Long id, OrderStatus status);
    void cancelMyOrder(Long id);

    void verifyPayment(Long id);

    void rejectPayment(Long id);
}