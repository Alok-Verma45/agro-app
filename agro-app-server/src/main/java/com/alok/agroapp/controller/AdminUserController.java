package com.alok.agroapp.controller;

import com.alok.agroapp.dto.AdminUserResponse;
import com.alok.agroapp.entity.enums.Role;
import com.alok.agroapp.service.AdminUserService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/users")
public class AdminUserController {

    private final AdminUserService adminUserService;

    public AdminUserController(
            AdminUserService adminUserService
    ) {
        this.adminUserService = adminUserService;
    }

    // =====================================
    // GET ALL USERS
    // =====================================
    @GetMapping
    public List<AdminUserResponse> getAllUsers() {
        return adminUserService.getAllUsers();
    }

    // =====================================
    // GET SINGLE USER
    // =====================================
    @GetMapping("/{id}")
    public AdminUserResponse getUserById(
            @PathVariable Long id
    ) {
        return adminUserService.getUserById(id);
    }

    // =====================================
    // UPDATE ROLE
    // =====================================
    @PutMapping("/{id}/role")
    public String updateRole(
            @PathVariable Long id,
            @RequestParam Role role
    ) {

        adminUserService.updateRole(id, role);

        return "Role updated successfully";
    }

    // =====================================
    // BLOCK / UNBLOCK USER
    // =====================================
    @PutMapping("/{id}/block")
    public String toggleBlock(
            @PathVariable Long id
    ) {

        adminUserService.toggleBlock(id);

        return "User block status updated";
    }

    // =====================================
    // DELETE USER
    // =====================================
    @DeleteMapping("/{id}")
    public String deleteUser(
            @PathVariable Long id
    ) {

        adminUserService.deleteUser(id);

        return "User deleted successfully";
    }
}