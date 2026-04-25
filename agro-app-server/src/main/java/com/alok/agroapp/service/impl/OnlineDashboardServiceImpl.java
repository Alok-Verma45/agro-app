package com.alok.agroapp.service.impl;

import com.alok.agroapp.dto.OnlineDashboardResponse;
import com.alok.agroapp.entity.Order;
import com.alok.agroapp.entity.enums.OrderStatus;
import com.alok.agroapp.repository.OrderRepository;
import com.alok.agroapp.repository.ProductRepository;
import com.alok.agroapp.repository.UserRepository;
import com.alok.agroapp.service.OnlineDashboardService;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class OnlineDashboardServiceImpl
        implements OnlineDashboardService {

    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    public OnlineDashboardServiceImpl(
            UserRepository userRepository,
            OrderRepository orderRepository,
            ProductRepository productRepository
    ) {
        this.userRepository = userRepository;
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
    }

    @Override
    public OnlineDashboardResponse getOnlineDashboard() {

        List<Order> orders = orderRepository.findAll();

        BigDecimal totalRevenue = orders.stream()
                .filter(order ->
                        order.getStatus() == OrderStatus.DELIVERED)
                .map(Order::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        long placed = orders.stream()
                .filter(o -> o.getStatus() == OrderStatus.PLACED)
                .count();

        long confirmed = orders.stream()
                .filter(o -> o.getStatus() == OrderStatus.CONFIRMED)
                .count();

        long shipped = orders.stream()
                .filter(o -> o.getStatus() == OrderStatus.SHIPPED)
                .count();

        long delivered = orders.stream()
                .filter(o -> o.getStatus() == OrderStatus.DELIVERED)
                .count();

        long cancelled = orders.stream()
                .filter(o -> o.getStatus() == OrderStatus.CANCELLED)
                .count();

        return OnlineDashboardResponse.builder()
                .totalUsers(userRepository.count())
                .totalOrders(orderRepository.count())
                .totalProducts(productRepository.count())
                .totalRevenue(totalRevenue)

                .placedOrders(placed)
                .confirmedOrders(confirmed)
                .shippedOrders(shipped)
                .deliveredOrders(delivered)
                .cancelledOrders(cancelled)

                .build();
    }
}