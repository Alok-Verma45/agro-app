package com.alok.agroapp.entity;

import com.alok.agroapp.entity.enums.Role;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // =====================================
    // BASIC INFO
    // =====================================
    @Column(nullable = false)
    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(unique = true, length = 15)
    private String phone;

    // =====================================
    // ROLE
    // =====================================
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    // =====================================
    // ACCOUNT STATUS
    // =====================================
    @Column(nullable = false)
    @Builder.Default
    private boolean blocked = false;

    // =====================================
    // CREATED TIME
    // =====================================
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    // =====================================
    // AUTO SET BEFORE INSERT
    // =====================================
    @PrePersist
    public void prePersist() {

        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }
}