package com.food_supply_chain.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "products")
@Data
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "batch_code", nullable = false, unique = true)
    private String batchCode;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private Double price;

    @Column(nullable = false)
    private Integer stock;

    @ManyToOne
    @JoinColumn(name = "farmer_id", nullable = false)
    private User createdBy;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "harvest_date")
    private LocalDate harvestDate;

    @Column(name = "expiration_date")
    private LocalDate expirationDate;

    @Column(name = "product_type")
    private String productType; // e.g., FRUIT, VEGETABLE, DAIRY, MEAT, etc.

    @Column(name = "organic")
    private Boolean organic = false;

    @Column(name = "certification")
    private String certification; // e.g., USDA Organic, Non-GMO, etc.

    @Column(name = "cultivation_method")
    private String cultivationMethod; // e.g., CONVENTIONAL, HYDROPONIC, GREENHOUSE, etc.

    @Column(name = "qr_code")
    private String qrCodeUrl;

    @Column(name = "image_url")
    private String imageUrl;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProductEnvironmentalCondition> environmentalConditions = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}