package com.alok.agroapp.service.impl;

import com.alok.agroapp.dto.OrderItemResponse;
import com.alok.agroapp.dto.OrderResponse;
import com.alok.agroapp.entity.*;
import com.alok.agroapp.entity.enums.OrderStatus;
import com.alok.agroapp.repository.CartRepository;
import com.alok.agroapp.repository.OrderRepository;
import com.alok.agroapp.repository.UserRepository;
import com.alok.agroapp.service.OrderService;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class OrderServiceImpl implements OrderService {

    private final UserRepository userRepository;
    private final CartRepository cartRepository;
    private final OrderRepository orderRepository;

    public OrderServiceImpl(UserRepository userRepository,
                            CartRepository cartRepository,
                            OrderRepository orderRepository) {
        this.userRepository = userRepository;
        this.cartRepository = cartRepository;
        this.orderRepository = orderRepository;
    }

    @Override
    @Transactional
    public void placeOrder() {

        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Cart cart = cartRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        if (cart.getItems() == null || cart.getItems().isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        // 🔥 Validate stock
        for (CartItem item : cart.getItems()) {
            Product product = item.getProduct();

            if (product.getQuantity() < item.getQuantity()) {
                throw new RuntimeException(
                        "Insufficient stock for product: " + product.getName()
                );
            }
        }

        // 🔥 Create Order
        Order order = Order.builder()
                .user(user)
                .totalAmount(cart.getTotalAmount())
                .createdAt(LocalDateTime.now())
                .status(OrderStatus.PLACED)
                .build();

        // 🔥 Create OrderItems
        List<OrderItem> orderItems = new ArrayList<>();

        for (CartItem cartItem : cart.getItems()) {

            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .product(cartItem.getProduct())
                    .quantity(cartItem.getQuantity())
                    .price(cartItem.getPriceAtTime())
                    .build();

            orderItems.add(orderItem);
        }

        order.setItems(orderItems);

        // 🔥 Reduce stock
        for (CartItem cartItem : cart.getItems()) {
            Product product = cartItem.getProduct();
            product.setQuantity(product.getQuantity() - cartItem.getQuantity());
        }

        // 🔥 Save order
        orderRepository.save(order);

        // 🔥 Clear cart
        cart.getItems().clear();
        cart.setTotalAmount(BigDecimal.ZERO);
        cartRepository.save(cart);
    }

    // 🔥 USER → get own orders (DTO)
    @Override
    public List<OrderResponse> getMyOrders() {

        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Order> orders = orderRepository.findByUser(user);

        return mapOrdersToResponse(orders);
    }

    // 🔥 ADMIN → get all orders (DTO)
    @Override
    public List<OrderResponse> getAllOrders() {
        List<Order> orders = orderRepository.findAll();
        return mapOrdersToResponse(orders);
    }

    @Override
    public OrderResponse getOrderById(Long id) {

        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        // 🔥 SECURITY CHECK
        boolean isOwner = order.getUser().getId().equals(user.getId());
        boolean isAdmin = SecurityContextHolder.getContext()
                .getAuthentication()
                .getAuthorities()
                .stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        if (!isOwner && !isAdmin) {
            throw new RuntimeException("You are not authorized to view this order");
        }

        // 🔥 Map to DTO
        List<OrderItemResponse> items = order.getItems().stream()
                .map(item -> OrderItemResponse.builder()
                        .productName(item.getProduct().getName())
                        .quantity(item.getQuantity())
                        .price(item.getPrice())
                        .build())
                .toList();

        return OrderResponse.builder()
                .id(order.getId())
                .totalAmount(order.getTotalAmount())
                .createdAt(order.getCreatedAt())
                .status(order.getStatus().name())
                .items(items)
                .build();
    }

    @Override
    @Transactional
    public void updateOrderStatus(Long id, OrderStatus newStatus) {

        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        OrderStatus currentStatus = order.getStatus();

        // 🔥 VALIDATION (existing)
        switch (currentStatus) {

            case PLACED:
                if (newStatus != OrderStatus.CONFIRMED && newStatus != OrderStatus.CANCELLED) {
                    throw new RuntimeException("Invalid status transition from PLACED");
                }
                break;

            case CONFIRMED:
                if (newStatus != OrderStatus.SHIPPED && newStatus != OrderStatus.CANCELLED) {
                    throw new RuntimeException("Invalid status transition from CONFIRMED");
                }
                break;

            case SHIPPED:
                if (newStatus != OrderStatus.DELIVERED) {
                    throw new RuntimeException("Invalid status transition from SHIPPED");
                }
                break;

            case DELIVERED:
            case CANCELLED:
                throw new RuntimeException("Order already completed. No further changes allowed");
        }

        // 🔥 ⭐ IMPORTANT LOGIC (ADD THIS)
        if (newStatus == OrderStatus.CANCELLED) {

            for (OrderItem item : order.getItems()) {
                Product product = item.getProduct();

                product.setQuantity(
                        product.getQuantity() + item.getQuantity()
                );
            }
        }

        order.setStatus(newStatus);
    }

    // 🔥 COMMON MAPPER (CLEAN CODE 🔥)
    private List<OrderResponse> mapOrdersToResponse(List<Order> orders) {

        return orders.stream().map(order -> {

            List<OrderItemResponse> items = order.getItems().stream()
                    .map(item -> OrderItemResponse.builder()
                            .productName(item.getProduct().getName())
                            .quantity(item.getQuantity())
                            .price(item.getPrice())
                            .build())
                    .toList();

            return OrderResponse.builder()
                    .id(order.getId())
                    .totalAmount(order.getTotalAmount())
                    .createdAt(order.getCreatedAt())
                    .status(order.getStatus().name())
                    .items(items)
                    .build();

        }).toList();
    }
}