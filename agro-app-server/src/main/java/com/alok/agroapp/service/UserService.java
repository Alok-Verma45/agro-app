package com.alok.agroapp.service;

import com.alok.agroapp.dto.UserResponse;
import com.alok.agroapp.entity.User;

public interface UserService {
    UserResponse getByEmail(String email);
    UserResponse updateProfile(String email, User updatedUser);
}
