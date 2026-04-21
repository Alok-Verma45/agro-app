package com.alok.agroapp.service;

import com.alok.agroapp.dto.CartResponse;
import com.alok.agroapp.entity.Cart;

public interface CartService {
    void addToCart(Long productId, int quantity);

    CartResponse getCart();

    void removeItem(Long itemId);

    void updateQuantity(Long itemId, int quantity);
}
