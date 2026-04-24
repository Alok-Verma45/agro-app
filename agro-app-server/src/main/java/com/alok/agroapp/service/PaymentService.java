package com.alok.agroapp.service;

import com.alok.agroapp.dto.PaymentOrderResponse;
import com.alok.agroapp.dto.PaymentVerifyRequest;

import java.util.Map;

public interface PaymentService {

    PaymentOrderResponse createOrder(Long amount) throws Exception;
    boolean verifyPayment(
            String razorpayOrderId,
            String razorpayPaymentId,
            String razorpaySignature
    ) throws Exception;

    Map<String, String> verifyPayment(
            PaymentVerifyRequest request
    ) throws Exception;
}