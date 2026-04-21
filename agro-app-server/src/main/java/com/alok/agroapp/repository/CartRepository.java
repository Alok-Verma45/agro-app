package com.alok.agroapp.repository;

import com.alok.agroapp.entity.Cart;
import com.alok.agroapp.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart, Long> {
    Optional<Cart> findByUser(User user);
}
