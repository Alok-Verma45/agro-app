package com.alok.agroapp.service.impl;

import com.alok.agroapp.dto.PaymentOrderResponse;
import com.alok.agroapp.dto.PaymentVerifyRequest;
import com.alok.agroapp.service.PaymentService;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.Utils;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class PaymentServiceImpl implements PaymentService {

    private final RazorpayClient razorpayClient;

    @Value("${razorpay.key-id}")
    private String keyId;

    @Value("${razorpay.key-secret}")
    private String keySecret;

    public PaymentServiceImpl(RazorpayClient razorpayClient) {
        this.razorpayClient = razorpayClient;
    }

    @Override
    public PaymentOrderResponse createOrder(Long amount) throws Exception {

        JSONObject options = new JSONObject();
        options.put("amount", amount);
        options.put("currency", "INR");
        options.put("receipt", "txn_" + System.currentTimeMillis());

        Order order = razorpayClient.orders.create(options);

        return new PaymentOrderResponse(
                order.get("id").toString(),
                ((Number) order.get("amount")).longValue(),
                order.get("currency").toString(),
                keyId
        );
    }

    @Override
    public boolean verifyPayment(
            String razorpayOrderId,
            String razorpayPaymentId,
            String razorpaySignature
    ) throws Exception {

        String payload = razorpayOrderId + "|" + razorpayPaymentId;

        return com.razorpay.Utils.verifySignature(
                payload,
                razorpaySignature,
                keySecret
        );
    }

    @Override
    public Map<String, String> verifyPayment(
            PaymentVerifyRequest request
    ) throws Exception {

        String payload =
                request.getRazorpayOrderId()
                        + "|"
                        + request.getRazorpayPaymentId();

        boolean verified = com.razorpay.Utils.verifySignature(
                payload,
                request.getRazorpaySignature(),
                keySecret
        );

        if (!verified) {
            throw new RuntimeException("Invalid payment signature");
        }

        return Map.of(
                "message", "Payment verified successfully"
        );
    }
}