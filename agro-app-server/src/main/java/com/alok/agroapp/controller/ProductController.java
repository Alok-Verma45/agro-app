package com.alok.agroapp.controller;

import com.alok.agroapp.dto.ProductRequest;
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
    @PostMapping(
            consumes =
                    "multipart/form-data"
    )
    public ResponseEntity<Product>
    createProduct(
            @ModelAttribute
            ProductRequest request
    ) {

        Product saved =
                productService
                        .createProduct(
                                request
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
    // UPDATE PRODUCT
    // ===============================
    @PutMapping(
            value = "/{id}",
            consumes =
                    "multipart/form-data"
    )
    public ResponseEntity<Product>
    updateProduct(
            @PathVariable Long id,
            @ModelAttribute
            ProductRequest request
    ) {

        return ResponseEntity.ok(
                productService
                        .updateProduct(
                                id,
                                request
                        )
        );
    }

    // ===============================
    // UPDATE STOCK EXACT VALUE
    // ===============================
    @PutMapping("/{id}/stock")
    public ResponseEntity<Product>
    updateStock(
            @PathVariable Long id,
            @RequestBody
            UpdateStockRequest request
    ) {

        return ResponseEntity.ok(
                productService
                        .updateStock(
                                id,
                                request
                                        .getQuantity()
                        )
        );
    }

    // ===============================
    // QUICK ADD STOCK
    // ===============================
    @PatchMapping("/{id}/add-stock")
    public ResponseEntity<Product>
    addStock(
            @PathVariable Long id,
            @RequestBody
            UpdateStockRequest request
    ) {

        Product product =
                productService
                        .getProductById(id);

        Integer updated =
                product.getQuantity()
                        +
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
    // ===============================
    @PatchMapping("/{id}/reduce-stock")
    public ResponseEntity<Product>
    reduceStock(
            @PathVariable Long id,
            @RequestBody
            UpdateStockRequest request
    ) {

        Product product =
                productService
                        .getProductById(id);

        Integer updated =
                Math.max(
                        0,
                        product.getQuantity()
                                -
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
    // ===============================
    @GetMapping("/low-stock")
    public ResponseEntity<List<Product>>
    lowStockProducts() {

        List<Product> low =
                productService
                        .getAllProducts()
                        .stream()
                        .filter(
                                p ->
                                        p.getQuantity()
                                                <= 10
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

        List<Product> out =
                productService
                        .getAllProducts()
                        .stream()
                        .filter(
                                p ->
                                        p.getQuantity()
                                                == 0
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