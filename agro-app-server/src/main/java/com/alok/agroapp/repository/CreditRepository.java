package com.alok.agroapp.repository;

import com.alok.agroapp.entity.Credit;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CreditRepository extends JpaRepository<Credit, Long> {
    List<Credit> findByCustomerId(Long customerId);
}
