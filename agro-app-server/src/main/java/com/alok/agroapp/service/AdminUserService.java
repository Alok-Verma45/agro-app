package com.alok.agroapp.service;

import com.alok.agroapp.dto.AdminUserResponse;
import com.alok.agroapp.entity.enums.Role;

import java.util.List;

public interface AdminUserService {

    List<AdminUserResponse> getAllUsers();

    void updateRole(Long id, Role role);

    void toggleBlock(Long id);

    void deleteUser(Long id);

    AdminUserResponse getUserById(Long id);
}