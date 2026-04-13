package com.alok.agroapp.service.impl;

import com.alok.agroapp.entity.Customer;
import com.alok.agroapp.entity.enums.CreditStatus;
import com.alok.agroapp.repository.CreditRepository;
import com.alok.agroapp.repository.CustomerRepository;
import com.alok.agroapp.service.CustomerService;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Transactional
@Service
public class CustomerServiceImpl implements CustomerService {

    private final CustomerRepository customerRepository;
    private final CreditRepository creditRepository;

    public CustomerServiceImpl(CustomerRepository customerRepository, CreditRepository creditRepository) {
        this.customerRepository = customerRepository;
        this.creditRepository = creditRepository;
    }

    @Override
    public Customer createCustomer(Customer customer) {
        return customerRepository.save(customer);
    }

    @Override
    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    @Override
    public Customer getCustomerById(Long id) {
        return customerRepository.findById(id)
                .orElseThrow(()-> new RuntimeException("Customer not found"));
    }

    @Override
    public Customer updateCustomer(Long id, Customer customer) {
        Customer existing = customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        existing.setName(customer.getName());
        existing.setPhone(customer.getPhone());
        existing.setAddress(customer.getAddress());
        return customerRepository.save(existing);
    }

    @Override
    public void deleteCustomer(Long id) {

        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        boolean hasPending = creditRepository
                .existsByCustomerIdAndStatus(id, CreditStatus.PENDING);

        if (hasPending) {
            throw new RuntimeException("Cannot delete customer with pending credits");
        }

        // 🔥 delete all credits first
        creditRepository.deleteByCustomerId(id);

        // then delete customer
        customerRepository.delete(customer);
    }
}
