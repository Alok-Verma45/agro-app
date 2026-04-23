package com.alok.agroapp.repository;

import com.alok.agroapp.entity.Order;
import com.alok.agroapp.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUser(User user);
}