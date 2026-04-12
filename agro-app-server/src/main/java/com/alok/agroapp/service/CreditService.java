package com.alok.agroapp.service;

import com.alok.agroapp.entity.Credit;

import java.util.List;

public interface CreditService {

    Credit createCredit(Long customerId, Credit credit);

    List<Credit> getAllCredits();

    List<Credit> getCreditsByCustomer(Long customerId);

    Credit addPayment(Long creditId, Double amount);

}