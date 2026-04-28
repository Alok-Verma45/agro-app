package com.alok.agroapp.entity;

import com.alok.agroapp.entity.enums.OrderStatus;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "orders")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // =========================
    // USER
    // =========================
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    // =========================
    // ORDER INFO
    // =========================
    private BigDecimal totalAmount;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @Enumerated(EnumType.STRING)
    private OrderStatus status;

    // =========================
    // DELIVERY DETAILS
    // =========================
    private String fullName;

    private String phone;

    private String pincode;

    private String city;

    private String state;

    private String addressLine;

    // =========================
    // PAYMENT INFO
    // =========================
    private String paymentMethod;
    // COD / UPI / RAZORPAY

    private String paymentStatus;
    // PENDING / PAID / FAILED / REFUNDED

    private String transactionId;
    // Razorpay payment id / UPI txn id

    private String razorpayOrderId;

    private String razorpayPaymentId;

    private LocalDateTime paidAt;

    // =========================
    // OPTIONAL EXTRA
    // =========================
    private String notes;

    private String cancelReason;

    private LocalDateTime deliveredAt;

    // =========================
    // ITEMS
    // =========================
    @OneToMany(
            mappedBy = "order",
            cascade = CascadeType.ALL,
            orphanRemoval = true,
            fetch = FetchType.LAZY
    )
    private List<OrderItem> items;

    // =========================
    // AUTO TIMESTAMP
    // =========================
    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now();
    }
}