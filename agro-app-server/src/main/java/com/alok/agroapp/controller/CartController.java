package com.alok.agroapp.controller;

import com.alok.agroapp.dto.CartResponse;
import com.alok.agroapp.entity.Cart;
import com.alok.agroapp.service.CartService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    // 🔥 Add to cart
    @PostMapping("/add")
    public String addToCart(@RequestParam Long productId,
                            @RequestParam int quantity) {

        cartService.addToCart(productId, quantity);
        return "Product added to cart";
    }
    @GetMapping
    public CartResponse getCart() {
        return cartService.getCart();
    }

    @DeleteMapping("/item/{itemId}")
    public String removeItem(@PathVariable Long itemId) {
        cartService.removeItem(itemId);
        return "Item removed successfully";
    }

    @PutMapping("/item/{itemId}")
    public String updateQuantity(@PathVariable Long itemId,
                                 @RequestParam int quantity) {

        cartService.updateQuantity(itemId, quantity);
        return "Quantity updated";
    }
}