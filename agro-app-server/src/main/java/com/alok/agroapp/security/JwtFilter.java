package com.alok.agroapp.security;

import com.alok.agroapp.entity.User;
import com.alok.agroapp.repository.UserRepository;
import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.List;

@Component
public class JwtFilter implements Filter {

    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    public JwtFilter(JwtUtil jwtUtil,
                     UserRepository userRepository) {
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
    }

    @Override
    public void doFilter(ServletRequest request,
                         ServletResponse response,
                         FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest req =
                (HttpServletRequest) request;

        HttpServletResponse res =
                (HttpServletResponse) response;

        String authHeader =
                req.getHeader("Authorization");

        if (authHeader != null &&
                authHeader.startsWith("Bearer ")) {

            String token =
                    authHeader.substring(7);

            try {

                String email =
                        jwtUtil.extractEmail(token);

                User user =
                        userRepository.findByEmail(email)
                                .orElseThrow(() ->
                                        new RuntimeException(
                                                "User not found"
                                        ));

                // =====================================
                // BLOCKED USER STOP
                // =====================================
                if (user.isBlocked()) {

                    res.setStatus(
                            HttpServletResponse.SC_FORBIDDEN
                    );

                    res.setContentType(
                            "application/json"
                    );

                    res.getWriter().write(
                            "{\"message\":\"Your account has been blocked by admin\"}"
                    );

                    return;
                }

                // =====================================
                // AUTHENTICATION
                // =====================================
                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                email,
                                null,
                                List.of(
                                        new SimpleGrantedAuthority(
                                                "ROLE_" +
                                                        user.getRole().name()
                                        )
                                )
                        );

                SecurityContextHolder.getContext()
                        .setAuthentication(authentication);

            } catch (RuntimeException e) {

                res.setStatus(
                        HttpServletResponse.SC_UNAUTHORIZED
                );

                res.setContentType(
                        "application/json"
                );

                res.getWriter().write(
                        "{\"message\":\"Invalid JWT token\"}"
                );

                return;
            }
        }

        chain.doFilter(request, response);
    }
}