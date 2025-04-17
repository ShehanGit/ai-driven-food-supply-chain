package com.food_supply_chain.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductDTO {
    private Long id;
    private String batchCode;
    private String name;
    private String description;
    private Double price;
    private Integer stock;
    private String createdByUsername;
    private LocalDateTime createdAt;
    private LocalDate harvestDate;
    private LocalDate expirationDate;
    private String productType;
    private Boolean organic;
    private String certification;
    private String cultivationMethod;
    private String qrCodeUrl;
    private String imageUrl;
    private List<ProductEnvironmentalConditionDTO> environmentalConditions;
}