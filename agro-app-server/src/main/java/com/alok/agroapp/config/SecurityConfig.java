package com.alok.agroapp.config;
import com.alok.agroapp.security.JwtFilter;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    private final JwtFilter jwtFilter;

    public SecurityConfig(JwtFilter jwtFilter) {
        this.jwtFilter = jwtFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth

                        // 🔓 Public APIs
                        .requestMatchers("/api/auth/**").permitAll()

                        // 👤 USER → only home
                        .requestMatchers("/api/home/**").hasAnyRole("USER", "ADMIN")

                        // 👑 ADMIN only
                        .requestMatchers("/api/products/**").hasRole("ADMIN")
                        .requestMatchers("/api/customers/**").hasRole("ADMIN")
                        .requestMatchers("/api/credits/**").hasRole("ADMIN")
                        .requestMatchers("/api/dashboard/**").hasRole("ADMIN")

                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}