package com.alok.agroapp.dto;

import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;

@Getter
@Setter
public class ProductRequest {

    private String name;
    private BigDecimal price;
    private Integer quantity;
    private String description;
    private String category;
    private MultipartFile image;
}