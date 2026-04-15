package com.alok.agroapp.service.impl;

import com.alok.agroapp.dto.*;
import com.alok.agroapp.entity.User;
import com.alok.agroapp.entity.enums.Role;
import com.alok.agroapp.repository.UserRepository;
import com.alok.agroapp.security.JwtUtil;
import com.alok.agroapp.service.AuthService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    public AuthServiceImpl(UserRepository userRepository, JwtUtil jwtUtil, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public AuthResponse register(RegisterRequest request) {

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword())) // 🔥 plain for now
                .role(Role.USER)
                .build();

        userRepository.save(user);

        return new AuthResponse("User registered successfully");
    }

    @Override
    public AuthResponse login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        String token = jwtUtil.generateToken(user.getEmail());

        // ✅ SEND ROLE ALSO
        return new AuthResponse(token, user.getRole().name());
    }
}