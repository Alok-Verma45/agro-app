package com.alok.agroapp.controller;

import com.alok.agroapp.dto.UpdateStockRequest;
import com.alok.agroapp.entity.Product;
import com.alok.agroapp.service.ProductService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:5173")
public class ProductController {

    private final ProductService productService;

    public ProductController(
            ProductService productService
    ) {
        this.productService =
                productService;
    }

    // ===============================
    // CREATE PRODUCT
    // ===============================
    @PostMapping
    public ResponseEntity<Product>
    createProduct(
            @RequestBody Product product
    ) {

        Product saved =
                productService
                        .createProduct(
                                product
                        );

        return ResponseEntity
                .status(
                        HttpStatus.CREATED
                )
                .body(saved);
    }

    // ===============================
    // GET ALL PRODUCTS
    // ===============================
    @GetMapping
    public ResponseEntity<List<Product>>
    getAllProducts() {

        return ResponseEntity.ok(
                productService
                        .getAllProducts()
        );
    }

    // ===============================
    // GET PRODUCT BY ID
    // ===============================
    @GetMapping("/{id}")
    public ResponseEntity<Product>
    getProductById(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                productService
                        .getProductById(id)
        );
    }

    // ===============================
    // FULL UPDATE PRODUCT
    // ===============================
    @PutMapping("/{id}")
    public ResponseEntity<Product>
    updateProduct(
            @PathVariable Long id,
            @RequestBody Product product
    ) {

        return ResponseEntity.ok(
                productService
                        .updateProduct(
                                id,
                                product
                        )
        );
    }

    // ===============================
    // UPDATE STOCK EXACT VALUE
    // Example: 55
    // ===============================
    @PutMapping("/{id}/stock")
    public ResponseEntity<Product>
    updateStock(
            @PathVariable Long id,
            @RequestBody UpdateStockRequest request
    ) {

        return ResponseEntity.ok(
                productService
                        .updateStock(
                                id,
                                request.getQuantity()
                        )
        );
    }

    // ===============================
    // QUICK ADD STOCK
    // current + qty
    // ===============================
    @PatchMapping("/{id}/add-stock")
    public ResponseEntity<Product>
    addStock(
            @PathVariable Long id,
            @RequestBody UpdateStockRequest request
    ) {

        Product product =
                productService
                        .getProductById(id);

        Integer current =
                product.getQuantity();

        Integer updated =
                current +
                        request.getQuantity();

        return ResponseEntity.ok(
                productService
                        .updateStock(
                                id,
                                updated
                        )
        );
    }

    // ===============================
    // QUICK REDUCE STOCK
    // current - qty
    // ===============================
    @PatchMapping("/{id}/reduce-stock")
    public ResponseEntity<Product>
    reduceStock(
            @PathVariable Long id,
            @RequestBody UpdateStockRequest request
    ) {

        Product product =
                productService
                        .getProductById(id);

        Integer current =
                product.getQuantity();

        Integer updated =
                Math.max(
                        0,
                        current -
                                request.getQuantity()
                );

        return ResponseEntity.ok(
                productService
                        .updateStock(
                                id,
                                updated
                        )
        );
    }

    // ===============================
    // LOW STOCK PRODUCTS
    // <=10
    // ===============================
    @GetMapping("/low-stock")
    public ResponseEntity<List<Product>>
    lowStockProducts() {

        List<Product> all =
                productService
                        .getAllProducts();

        List<Product> low =
                all.stream()
                        .filter(
                                p ->
                                        p.getQuantity() <= 10
                        )
                        .toList();

        return ResponseEntity.ok(
                low
        );
    }

    // ===============================
    // OUT OF STOCK
    // ===============================
    @GetMapping("/out-stock")
    public ResponseEntity<List<Product>>
    outOfStockProducts() {

        List<Product> all =
                productService
                        .getAllProducts();

        List<Product> out =
                all.stream()
                        .filter(
                                p ->
                                        p.getQuantity() == 0
                        )
                        .toList();

        return ResponseEntity.ok(
                out
        );
    }

    // ===============================
    // DELETE PRODUCT
    // ===============================
    @DeleteMapping("/{id}")
    public ResponseEntity<String>
    deleteProduct(
            @PathVariable Long id
    ) {

        productService
                .deleteProduct(id);

        return ResponseEntity.ok(
                "Product deleted successfully"
        );
    }
}