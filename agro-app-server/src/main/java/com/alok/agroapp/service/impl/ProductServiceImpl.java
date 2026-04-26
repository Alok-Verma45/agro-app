package com.alok.agroapp.service.impl;

import com.alok.agroapp.dto.ProductRequest;
import com.alok.agroapp.entity.Product;
import com.alok.agroapp.repository.ProductRepository;
import com.alok.agroapp.service.CloudinaryService;
import com.alok.agroapp.service.ProductService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final CloudinaryService cloudinaryService;

    public ProductServiceImpl(
            ProductRepository productRepository,
            CloudinaryService cloudinaryService
    ) {
        this.productRepository =
                productRepository;
        this.cloudinaryService =
                cloudinaryService;
    }

    @Override
    public Product createProduct(
            ProductRequest request
    ) {

        if (productRepository
                .existsByNameIgnoreCase(
                        request.getName()
                )) {

            throw new RuntimeException(
                    "Product already exists"
            );
        }

        String imageUrl =
                cloudinaryService
                        .uploadImage(
                                request.getImage()
                        );

        Product product =
                Product.builder()
                        .name(request.getName())
                        .price(request.getPrice())
                        .quantity(request.getQuantity())
                        .description(request.getDescription())
                        .category(request.getCategory())
                        .imageUrl(imageUrl)
                        .build();

        return productRepository.save(
                product
        );
    }

    @Override
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    @Override
    public Product getProductById(
            Long id
    ) {

        return productRepository
                .findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Product not found"
                        )
                );
    }

    @Override
    public Product updateProduct(
            Long id,
            ProductRequest request
    ) {

        Product existing =
                productRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Product not found"
                                )
                        );

        existing.setName(
                request.getName()
        );

        existing.setPrice(
                request.getPrice()
        );

        existing.setQuantity(
                request.getQuantity()
        );

        existing.setDescription(
                request.getDescription()
        );

        existing.setCategory(
                request.getCategory()
        );

        if (request.getImage() != null &&
                !request.getImage().isEmpty()) {

            String imageUrl =
                    cloudinaryService
                            .uploadImage(
                                    request.getImage()
                            );

            existing.setImageUrl(
                    imageUrl
            );
        }

        return productRepository.save(
                existing
        );
    }

    @Override
    public void deleteProduct(
            Long id
    ) {

        Product existing =
                productRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Product not found"
                                )
                        );

        productRepository.delete(
                existing
        );
    }

    @Override
    public Product updateStock(
            Long id,
            Integer quantity
    ) {

        Product product =
                productRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Product not found"
                                )
                        );

        product.setQuantity(
                quantity
        );

        return productRepository.save(
                product
        );
    }
}