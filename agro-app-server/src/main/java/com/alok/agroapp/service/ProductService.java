package com.alok.agroapp.service;

import com.alok.agroapp.entity.Product;

import java.util.List;

public interface ProductService {
    Product createProduct(Product product);

    List<Product> getAllProducts();

    Product getProductById(Long id);

    Product updateProduct(Long id, Product product);

    void deleteProduct(Long id);

    Product updateStock(Long id, Integer quantity);
}
