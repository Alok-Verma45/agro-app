package com.alok.agroapp.service;

import com.alok.agroapp.dto.UserResponse;
import com.alok.agroapp.entity.enums.Role;

import java.util.List;

public interface AdminUserService {

    List<UserResponse> getAllUsers();

    void updateRole(Long id, Role role);

    void toggleBlock(Long id);

    void deleteUser(Long id);

    UserResponse getUserById(Long id);
}