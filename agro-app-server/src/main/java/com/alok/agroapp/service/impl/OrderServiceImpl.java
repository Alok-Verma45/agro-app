package com.alok.agroapp.service.impl;

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

        // 🔥 1. Get user
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 🔥 2. Get cart
        Cart cart = cartRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        // 🔥 3. Check empty
        if (cart.getItems() == null || cart.getItems().isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        // 🔥 4. Validate stock
        for (CartItem item : cart.getItems()) {

            Product product = item.getProduct();

            if (product.getQuantity() < item.getQuantity()) {
                throw new RuntimeException(
                        "Insufficient stock for product: " + product.getName()
                );
            }
        }

        // 🔥 5. Create Order
        Order order = Order.builder()
                .user(user)
                .totalAmount(cart.getTotalAmount())
                .createdAt(LocalDateTime.now())
                .status(OrderStatus.PLACED)
                .build();

        // 🔥 6. Create OrderItems
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

        // 🔥 7. Attach items
        order.setItems(orderItems);

        // 🔥 8. Reduce stock
        for (CartItem cartItem : cart.getItems()) {

            Product product = cartItem.getProduct();

            product.setQuantity(product.getQuantity() - cartItem.getQuantity());
        }

        // 🔥 9. Save order (cascade saves items)
        orderRepository.save(order);

        // 🔥 10. Clear cart
        cart.getItems().clear();
        cart.setTotalAmount(BigDecimal.ZERO);
        cartRepository.save(cart);
    }
}