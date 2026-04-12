package com.alok.agroapp.repository;

import com.alok.agroapp.entity.Credit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CreditRepository extends JpaRepository<Credit, Long> {
    List<Credit> findByCustomerId(Long customerId);

    @Query("SELECT COALESCE(SUM(c.totalAmount), 0) FROM Credit c")
    Double getTotalCreditAmount();

    @Query("SELECT COALESCE(SUM(c.paidAmount), 0) FROM Credit c")
    Double getTotalPaidAmount();

    @Query("SELECT COALESCE(SUM(c.pendingAmount), 0) FROM Credit c")
    Double getTotalPendingAmount();
}
