package com.food_supply_chain.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "batches")
@Data
public class Batch {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "batch_code", nullable = false, unique = true)
    private String batchCode;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    @Column(name = "production_date", nullable = false)
    private LocalDate productionDate;

    @Column(name = "expiration_date")
    private LocalDate expirationDate;

    @Column(name = "status", nullable = false)
    @Enumerated(EnumType.STRING)
    private BatchStatus status = BatchStatus.CREATED;

    @Column(name = "qr_code_url")
    private String qrCodeUrl;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "created_by_id", nullable = false)
    private User createdBy;

    @Column(name = "notes", length = 1000)
    private String notes;

    // One batch can have multiple events
    @OneToMany(mappedBy = "batch", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<BatchEvent> events = new ArrayList<>();

    public enum BatchStatus {
        CREATED, // Initial state when batch is created
        HARVESTED, // After harvesting
        IN_STORAGE, // When in storage
        IN_TRANSIT, // During transportation
        DELIVERED, // Delivered to distributor
        AT_RETAILER, // At retail location
        SOLD, // Sold to consumer
        EXPIRED, // Past expiration date
        RECALLED // Recalled due to quality issues
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}