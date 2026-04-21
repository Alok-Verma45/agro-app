package com.alok.agroapp.service.impl;

import com.alok.agroapp.dto.CartItemResponse;
import com.alok.agroapp.dto.CartResponse;
import com.alok.agroapp.entity.*;
import com.alok.agroapp.repository.*;
import com.alok.agroapp.service.CartService;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public CartServiceImpl(CartRepository cartRepository,
                           ProductRepository productRepository,
                           UserRepository userRepository) {
        this.cartRepository = cartRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    @Override
    public void addToCart(Long productId, int quantity) {

        // 🔥 1. Get logged-in user
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 🔥 2. Get or create cart
        Cart cart = cartRepository.findByUser(user)
                .orElseGet(() -> {
                    Cart newCart = new Cart();
                    newCart.setUser(user);
                    newCart.setItems(new ArrayList<>());
                    newCart.setTotalAmount(BigDecimal.ZERO);
                    return newCart;
                });

        // 🔥 3. Get product
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // 🔥 4. Check if item already exists
        Optional<CartItem> existingItem = cart.getItems().stream()
                .filter(item -> item.getProduct().getId().equals(productId))
                .findFirst();

        if (existingItem.isPresent()) {
            // ✔ Increase quantity
            CartItem item = existingItem.get();
            item.setQuantity(item.getQuantity() + quantity);
        } else {
            // ✔ Add new item
            CartItem newItem = CartItem.builder()
                    .cart(cart)
                    .product(product)
                    .quantity(quantity)
                    .priceAtTime(product.getPrice()) // 🔥 important
                    .build();

            cart.getItems().add(newItem);
        }

        // 🔥 5. Recalculate total
        BigDecimal total = cart.getItems().stream()
                .map(item -> item.getPriceAtTime()
                        .multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        cart.setTotalAmount(total);

        // 🔥 6. Save cart
        cartRepository.save(cart);
    }

    @Override
    public CartResponse getCart() {

        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Cart cart = cartRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Cart is empty"));

        List<CartItemResponse> items = cart.getItems().stream()
                .map(item -> new CartItemResponse(
                        item.getId(),   // 🔥 ADD THIS
                        item.getProduct().getName(),
                        item.getQuantity(),
                        item.getPriceAtTime()
                ))
                .toList();

        return new CartResponse(
                cart.getId(),
                cart.getTotalAmount(),
                items
        );
    }

    @Override
    public void removeItem(Long itemId) {

        // 🔥 1. Get logged-in user
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 🔥 2. Get cart
        Cart cart = cartRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        // 🔥 3. Find item
        CartItem itemToRemove = cart.getItems().stream()
                .filter(item -> item.getId().equals(itemId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Item not found in cart"));

        // 🔥 4. Remove item
        cart.getItems().remove(itemToRemove);

        // 🔥 5. Recalculate total
        BigDecimal total = cart.getItems().stream()
                .map(item -> item.getPriceAtTime()
                        .multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        cart.setTotalAmount(total);

        // 🔥 6. Save cart
        cartRepository.save(cart);
    }

    @Override
    public void updateQuantity(Long itemId, int quantity) {

        // 🔥 1. Get user
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 🔥 2. Get cart
        Cart cart = cartRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        // 🔥 3. Find item
        CartItem item = cart.getItems().stream()
                .filter(i -> i.getId().equals(itemId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Item not found"));

        // 🔥 4. Update quantity
        item.setQuantity(quantity);

        // 🔥 5. Recalculate total
        BigDecimal total = cart.getItems().stream()
                .map(i -> i.getPriceAtTime()
                        .multiply(BigDecimal.valueOf(i.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        cart.setTotalAmount(total);

        // 🔥 6. Save
        cartRepository.save(cart);
    }
}