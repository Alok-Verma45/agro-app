package com.alok.agroapp.service;

import com.alok.agroapp.dto.OrderResponse;
import com.alok.agroapp.entity.Order;

import java.util.List;

public interface OrderService {
    void placeOrder();

    List<OrderResponse> getMyOrders();
    List<OrderResponse> getAllOrders();
    OrderResponse getOrderById(Long id);
}