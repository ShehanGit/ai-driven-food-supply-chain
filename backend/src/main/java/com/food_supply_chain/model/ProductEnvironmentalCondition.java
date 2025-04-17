package com.food_supply_chain.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "product_environmental_conditions")
@Data
public class ProductEnvironmentalCondition {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(name = "timestamp", nullable = false)
    private LocalDateTime timestamp;

    @Column(name = "temperature")
    private Double temperature; // in Celsius

    @Column(name = "humidity")
    private Double humidity; // percentage

    @Column(name = "light_exposure")
    private Double lightExposure; // lux

    @Column(name = "soil_moisture")
    private Double soilMoisture; // percentage

    @Column(name = "soil_ph")
    private Double soilPh; // pH value

    @Column(name = "air_quality")
    private Double airQuality; // index value

    @Column(name = "recorded_by")
    private String recordedBy; // username or device ID

    @Column(name = "location", length = 500)
    private String location; // geolocation or description

    @Column(name = "notes", length = 1000)
    private String notes;

    @PrePersist
    protected void onCreate() {
        this.timestamp = LocalDateTime.now();
    }
}