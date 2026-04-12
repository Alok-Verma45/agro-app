package com.alok.agroapp.entity;

import com.alok.agroapp.entity.enums.CreditStatus;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "credits")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Credit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 🔗 Many credits → One customer
    @ManyToOne
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    @Column(nullable = false)
    private BigDecimal totalAmount;

    @Column(nullable = false)
    private BigDecimal paidAmount;

    @Column(nullable = false)
    private BigDecimal pendingAmount;

    @Enumerated(EnumType.STRING)
    private CreditStatus status;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();

        // auto calculate pending
        this.pendingAmount = totalAmount.subtract(paidAmount);

        // auto set status
        if (pendingAmount.compareTo(BigDecimal.ZERO) == 0) {
            this.status = CreditStatus.PAID;
        } else {
            this.status = CreditStatus.PENDING;
        }
    }
}