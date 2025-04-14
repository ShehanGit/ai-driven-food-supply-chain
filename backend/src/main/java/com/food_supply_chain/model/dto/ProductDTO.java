package com.food_supply_chain.model.dto;

import java.time.LocalDateTime;

public class ProductDTO {
    private Long id;
    private String batchCode;
    private String name;
    private String description;
    private Double price;
    private Integer stock;
    private String createdByUsername;
    private LocalDateTime createdAt; // Added field

    // Constructors
    public ProductDTO() {}

    public ProductDTO(Long id, String batchCode, String name, String description, Double price, Integer stock, String createdByUsername, LocalDateTime createdAt) {
        this.id = id;
        this.batchCode = batchCode;
        this.name = name;
        this.description = description;
        this.price = price;
        this.stock = stock;
        this.createdByUsername = createdByUsername;
        this.createdAt = createdAt;
    }

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getBatchCode() { return batchCode; }
    public void setBatchCode(String batchCode) { this.batchCode = batchCode; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }
    public Integer getStock() { return stock; }
    public void setStock(Integer stock) { this.stock = stock; }
    public String getCreatedByUsername() { return createdByUsername; }
    public void setCreatedByUsername(String createdByUsername) { this.createdByUsername = createdByUsername; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}