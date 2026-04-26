package com.alok.agroapp.service;

import com.alok.agroapp.dto.ProductRequest;
import com.alok.agroapp.entity.Product;

import java.util.List;

public interface ProductService {

    List<Product> getAllProducts();

    Product getProductById(Long id);

    void deleteProduct(Long id);

    Product updateStock(Long id, Integer quantity);
    Product createProduct(ProductRequest request);

    Product updateProduct(Long id, ProductRequest request);
}