package com.alok.agroapp.service.impl;

import com.alok.agroapp.dto.OrderItemResponse;
import com.alok.agroapp.dto.OrderResponse;
import com.alok.agroapp.dto.PlaceOrderRequest;
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

    public OrderServiceImpl(
            UserRepository userRepository,
            CartRepository cartRepository,
            OrderRepository orderRepository
    ) {
        this.userRepository = userRepository;
        this.cartRepository = cartRepository;
        this.orderRepository = orderRepository;
    }

    // ==========================================
    // PLACE ORDER
    // ==========================================
    @Override
    @Transactional
    public void placeOrder(PlaceOrderRequest request) {

        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        Cart cart = cartRepository.findByUser(user)
                .orElseThrow(() ->
                        new RuntimeException("Cart not found"));

        if (cart.getItems() == null || cart.getItems().isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        // STOCK CHECK
        for (CartItem item : cart.getItems()) {

            Product product = item.getProduct();

            if (product.getQuantity() < item.getQuantity()) {
                throw new RuntimeException(
                        "Insufficient stock for " + product.getName()
                );
            }
        }

        // PAYMENT
        String paymentMethod =
                request.getPaymentMethod() == null
                        ? "COD"
                        : request.getPaymentMethod();

        // ALWAYS PENDING FIRST
        Order order = Order.builder()
                .user(user)
                .totalAmount(cart.getTotalAmount())
                .status(OrderStatus.PLACED)

                // DELIVERY
                .fullName(request.getFullName())
                .phone(request.getPhone())
                .pincode(request.getPincode())
                .city(request.getCity())
                .state(request.getState())
                .addressLine(request.getAddressLine())

                // PAYMENT
                .paymentMethod(paymentMethod)
                .paymentStatus("PENDING")
                .transactionId(request.getTransactionId())
                .paidAt(null)

                .build();

        // ITEMS
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

        // REDUCE STOCK
        for (CartItem cartItem : cart.getItems()) {

            Product product = cartItem.getProduct();

            product.setQuantity(
                    product.getQuantity()
                            - cartItem.getQuantity()
            );
        }

        orderRepository.saveAndFlush(order);

        // CLEAR CART
        cart.getItems().clear();
        cart.setTotalAmount(BigDecimal.ZERO);

        cartRepository.save(cart);
    }

    // ==========================================
    // USER ORDERS
    // ==========================================
    @Override
    @Transactional(readOnly = true)
    public List<OrderResponse> getMyOrders() {

        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        return mapOrdersToResponse(
                orderRepository.findByUser(user)
        );
    }

    // ==========================================
    // ADMIN ORDERS
    // ==========================================
    @Override
    @Transactional(readOnly = true)
    public List<OrderResponse> getAllOrders() {
        return mapOrdersToResponse(
                orderRepository.findAll()
        );
    }

    // ==========================================
    // ORDER BY ID
    // ==========================================
    @Override
    @Transactional(readOnly = true)
    public OrderResponse getOrderById(Long id) {

        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        Order order = orderRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Order not found"));

        boolean isOwner =
                order.getUser()
                        .getId()
                        .equals(user.getId());

        boolean isAdmin =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication()
                        .getAuthorities()
                        .stream()
                        .anyMatch(a ->
                                a.getAuthority()
                                        .equals("ROLE_ADMIN"));

        if (!isOwner && !isAdmin) {
            throw new RuntimeException("Unauthorized");
        }

        return mapSingleOrder(order);
    }

    // ==========================================
    // ADMIN UPDATE ORDER STATUS
    // ==========================================
    @Override
    @Transactional
    public void updateOrderStatus(
            Long id,
            OrderStatus newStatus
    ) {

        Order order = orderRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Order not found"));

        OrderStatus currentStatus = order.getStatus();

        switch (currentStatus) {

            case PLACED:
                if (newStatus != OrderStatus.CONFIRMED &&
                        newStatus != OrderStatus.CANCELLED) {
                    throw new RuntimeException("Invalid transition");
                }
                break;

            case CONFIRMED:
                if (newStatus != OrderStatus.SHIPPED &&
                        newStatus != OrderStatus.CANCELLED) {
                    throw new RuntimeException("Invalid transition");
                }
                break;

            case SHIPPED:
                if (newStatus != OrderStatus.DELIVERED) {
                    throw new RuntimeException("Invalid transition");
                }
                break;

            case DELIVERED:
            case CANCELLED:
                throw new RuntimeException("Completed order");
        }

        // CANCELLED
        if (newStatus == OrderStatus.CANCELLED) {

            for (OrderItem item : order.getItems()) {

                Product product = item.getProduct();

                product.setQuantity(
                        product.getQuantity()
                                + item.getQuantity()
                );
            }

            if ("PAID".equalsIgnoreCase(order.getPaymentStatus())) {
                order.setPaymentStatus("REFUNDED");
            } else {
                order.setPaymentStatus("CANCELLED");
            }
        }

        // DELIVERED
        if (newStatus == OrderStatus.DELIVERED) {

            order.setDeliveredAt(LocalDateTime.now());

            // COD can be marked paid on delivery
            if ("COD".equalsIgnoreCase(order.getPaymentMethod())
                    && "PENDING".equalsIgnoreCase(order.getPaymentStatus())) {

                order.setPaymentStatus("PAID");
                order.setPaidAt(LocalDateTime.now());

                if (order.getTransactionId() == null) {
                    order.setTransactionId("COD-" + order.getId());
                }
            }
        }

        order.setStatus(newStatus);
    }

    // ==========================================
    // USER CANCEL ORDER
    // ==========================================
    @Override
    @Transactional
    public void cancelMyOrder(Long id) {

        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        Order order = orderRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Order not found"));

        if (!order.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        if (order.getStatus() != OrderStatus.PLACED &&
                order.getStatus() != OrderStatus.CONFIRMED) {
            throw new RuntimeException(
                    "Order cannot be cancelled now"
            );
        }

        // RESTOCK
        for (OrderItem item : order.getItems()) {

            Product product = item.getProduct();

            product.setQuantity(
                    product.getQuantity()
                            + item.getQuantity()
            );
        }

        if ("PAID".equalsIgnoreCase(order.getPaymentStatus())) {
            order.setPaymentStatus("REFUNDED");
        } else {
            order.setPaymentStatus("CANCELLED");
        }

        order.setStatus(OrderStatus.CANCELLED);
    }

    // ==========================================
    // VERIFY PAYMENT
    // ==========================================
    @Override
    @Transactional
    public void verifyPayment(Long id) {

        Order order = orderRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Order not found"));

        if ("PAID".equalsIgnoreCase(order.getPaymentStatus())) {
            throw new RuntimeException("Already paid");
        }

        if ("FAILED".equalsIgnoreCase(order.getPaymentStatus())) {
            throw new RuntimeException("Rejected payment cannot verify");
        }

        order.setPaymentStatus("PAID");
        order.setPaidAt(LocalDateTime.now());

        if (order.getTransactionId() == null ||
                order.getTransactionId().isBlank()) {

            order.setTransactionId(
                    order.getPaymentMethod() + "-" + order.getId()
            );
        }
    }

    // ==========================================
    // REJECT PAYMENT
    // ==========================================
    @Override
    @Transactional
    public void rejectPayment(Long id) {

        Order order = orderRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Order not found"));

        if ("PAID".equalsIgnoreCase(order.getPaymentStatus())) {
            throw new RuntimeException("Paid payment cannot reject");
        }

        order.setPaymentStatus("FAILED");
        order.setPaidAt(null);
    }

    // ==========================================
    // COMMON MAPPER
    // ==========================================
    private List<OrderResponse> mapOrdersToResponse(
            List<Order> orders
    ) {
        return orders.stream()
                .map(this::mapSingleOrder)
                .toList();
    }

    // ==========================================
    // SINGLE MAPPER
    // ==========================================
    private OrderResponse mapSingleOrder(Order order) {

        List<OrderItemResponse> items =
                order.getItems()
                        .stream()
                        .map(item ->
                                OrderItemResponse.builder()
                                        .productName(
                                                item.getProduct().getName()
                                        )
                                        .quantity(item.getQuantity())
                                        .price(item.getPrice())
                                        .build()
                        )
                        .toList();

        return OrderResponse.builder()
                .id(order.getId())
                .totalAmount(order.getTotalAmount())
                .createdAt(order.getCreatedAt())
                .status(order.getStatus().name())

                // CUSTOMER
                .userName(order.getUser().getName())
                .email(order.getUser().getEmail())

                .phone(
                        order.getPhone() != null
                                ? order.getPhone()
                                : order.getUser().getPhone()
                )

                // DELIVERY
                .fullName(order.getFullName())
                .pincode(order.getPincode())
                .city(order.getCity())
                .state(order.getState())
                .addressLine(order.getAddressLine())

                // PAYMENT
                .paymentMethod(order.getPaymentMethod())
                .paymentStatus(order.getPaymentStatus())
                .transactionId(order.getTransactionId())
                .paidAt(order.getPaidAt())
                .deliveredAt(order.getDeliveredAt())

                .items(items)
                .build();
    }
}