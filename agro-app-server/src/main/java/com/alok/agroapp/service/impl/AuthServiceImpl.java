package com.alok.agroapp.service.impl;

import com.alok.agroapp.dto.*;
import com.alok.agroapp.entity.PasswordResetToken;
import com.alok.agroapp.entity.User;
import com.alok.agroapp.entity.enums.Role;
import com.alok.agroapp.repository.PasswordResetTokenRepository;
import com.alok.agroapp.repository.UserRepository;
import com.alok.agroapp.security.JwtUtil;
import com.alok.agroapp.service.AuthService;
import com.alok.agroapp.service.EmailService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final EmailService emailService;

    public AuthServiceImpl(UserRepository userRepository, JwtUtil jwtUtil, PasswordEncoder passwordEncoder, PasswordResetTokenRepository passwordResetTokenRepository, EmailService emailService) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
        this.passwordResetTokenRepository = passwordResetTokenRepository;
        this.emailService = emailService;
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

    @Override
    public void forgotPassword(String email) {

        // 🔥 1. Check user
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 🔥 2. Generate token
        String token = UUID.randomUUID().toString();

        // 🔥 3. Set expiry (15 min)
        LocalDateTime expiry = LocalDateTime.now().plusMinutes(15);

        // 🔥 4. Create entity
        PasswordResetToken resetToken = PasswordResetToken.builder()
                .token(token)
                .user(user)
                .expiryTime(expiry)
                .build();

        // 🔥 5. Save in DB
        passwordResetTokenRepository.save(resetToken);

        // 🔥 6. Create reset link (frontend URL)
        String resetLink = "http://localhost:5173/reset-password?token=" + token;

        // 🔥 7. Email body
        String body = "Hello " + user.getName() + ",\n\n"
                + "Click the link below to reset your password:\n"
                + resetLink + "\n\n"
                + "This link will expire in 15 minutes.\n\n"
                + "Regards,\nAgro App Team";

        // 🔥 8. Send email
        emailService.sendEmail(user.getEmail(), "Reset Your Password", body);
    }

    @Override
    public void resetPassword(String token, String newPassword) {

        // 🔥 1. Find token
        PasswordResetToken resetToken = passwordResetTokenRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid token"));

        // 🔥 2. Check expiry
        if (resetToken.getExpiryTime().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Token expired");
        }

        // 🔥 3. Get user
        User user = resetToken.getUser();

        // 🔥 4. Update password (encoded)
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        // 🔥 5. Delete token (optional but best practice)
        passwordResetTokenRepository.delete(resetToken);
    }
}