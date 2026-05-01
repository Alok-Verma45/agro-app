package com.alok.agroapp.config;

import com.alok.agroapp.security.JwtFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.*;

import java.util.List;

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
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration config =
                new CorsConfiguration();

        config.setAllowedOriginPatterns(List.of(
                "http://localhost:*",
                "https://*.vercel.app"
        ));

        config.setAllowedMethods(
                List.of(
                        "GET",
                        "POST",
                        "PUT",
                        "PATCH",
                        "DELETE",
                        "OPTIONS"
                )
        );

        config.setAllowedHeaders(
                List.of("*")
        );

        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration(
                "/**",
                config
        );

        return source;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http
    ) throws Exception {

        http
                .csrf(
                        AbstractHttpConfigurer::disable
                )

                .cors(cors ->
                        cors.configurationSource(
                                corsConfigurationSource()
                        )
                )

                .formLogin(
                        AbstractHttpConfigurer::disable
                )

                .httpBasic(
                        AbstractHttpConfigurer::disable
                )

                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )

                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                HttpMethod.OPTIONS,
                                "/**"
                        ).permitAll()

                        // ===============================
                        // PUBLIC
                        // ===============================
                        .requestMatchers(
                                "/",
                                "/health",
                                "/api/auth/**",
                                "/products/**"
                        ).permitAll()

                        // ===============================
                        // HOME
                        // ===============================
                        .requestMatchers(
                                "/api/home/**"
                        ).hasAnyRole(
                                "USER",
                                "ADMIN"
                        )

                        .requestMatchers(
                                "/api/users/**"
                        ).hasAnyRole("USER", "ADMIN")

                        // ===============================
                        // PRODUCTS VIEW
                        // ===============================
                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/products/**"
                        ).hasAnyRole(
                                "USER",
                                "ADMIN"
                        )

                        // ===============================
                        // PRODUCTS ADMIN ONLY
                        // ===============================
                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/products/**"
                        ).hasRole("ADMIN")

                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/products/**"
                        ).hasRole("ADMIN")

                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/api/products/**"
                        ).hasRole("ADMIN")

                        .requestMatchers(
                                HttpMethod.PATCH,
                                "/api/products/**"
                        ).hasRole("ADMIN")

                        // ===============================
                        // USER ORDERS
                        // ===============================
                        .requestMatchers(
                                "/api/orders/place"
                        ).hasRole("USER")

                        .requestMatchers(
                                "/api/orders/my"
                        ).hasRole("USER")

                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/orders/*/cancel"
                        ).hasRole("USER")

                        // ===============================
                        // ADMIN
                        // ===============================
                        .requestMatchers(
                                "/api/orders/all"
                        ).hasRole("ADMIN")

                        .requestMatchers(
                                "/api/orders/*/status"
                        ).hasRole("ADMIN")

                        .requestMatchers(
                                "/api/customers/**"
                        ).hasRole("ADMIN")

                        .requestMatchers(
                                "/api/credits/**"
                        ).hasRole("ADMIN")

                        .requestMatchers(
                                "/api/dashboard/**"
                        ).hasRole("ADMIN")

                        .requestMatchers(
                                "/api/admin/**"
                        ).hasRole("ADMIN")

                        // ===============================
                        // OTHERS
                        // ===============================
                        .anyRequest()
                        .authenticated()
                )

                .addFilterBefore(
                        jwtFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }

    @Bean
    public UserDetailsService userDetailsService() {
        return new InMemoryUserDetailsManager();
    }
}