package com.alok.agroapp.service.impl;

import com.alok.agroapp.dto.AdminUserResponse;
import com.alok.agroapp.entity.Order;
import com.alok.agroapp.entity.User;
import com.alok.agroapp.entity.enums.Role;
import com.alok.agroapp.repository.OrderRepository;
import com.alok.agroapp.repository.UserRepository;
import com.alok.agroapp.service.AdminUserService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminUserServiceImpl implements AdminUserService {

    private final UserRepository userRepository;
    private final OrderRepository orderRepository;

    public AdminUserServiceImpl(UserRepository userRepository,
                                OrderRepository orderRepository) {
        this.userRepository = userRepository;
        this.orderRepository = orderRepository;
    }

    // ==========================================
    // GET ALL USERS
    // ==========================================
    @Override
    public List<AdminUserResponse> getAllUsers() {

        return userRepository.findAll()
                .stream()
                .map(this::mapAdminUserResponse)
                .toList();
    }

    // ==========================================
    // GET SINGLE USER
    // ==========================================
    @Override
    public AdminUserResponse getUserById(Long id) {

        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        return mapAdminUserResponse(user);
    }

    // ==========================================
    // UPDATE ROLE
    // ==========================================
    @Override
    public void updateRole(Long id, Role role) {

        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        user.setRole(role);

        userRepository.save(user);
    }

    // ==========================================
    // BLOCK / UNBLOCK
    // ==========================================
    @Override
    public void toggleBlock(Long id) {

        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        user.setBlocked(!user.isBlocked());

        userRepository.save(user);
    }

    // ==========================================
    // DELETE USER
    // ==========================================
    @Override
    public void deleteUser(Long id) {

        User user = userRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        userRepository.delete(user);
    }

    // ==========================================
    // COMMON DTO MAPPER
    // ==========================================
    private AdminUserResponse mapAdminUserResponse(User user) {

        List<Order> orders =
                orderRepository.findByUser(user);

        int totalOrders = orders.size();

        double totalSpent = orders.stream()
                .map(order ->
                        order.getTotalAmount()
                                .doubleValue())
                .reduce(0.0, Double::sum);

        return AdminUserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .role(user.getRole().name())

                .blocked(user.isBlocked())
                .createdAt(user.getCreatedAt())

                .totalOrders(totalOrders)
                .totalSpent(totalSpent)

                .build();
    }
}