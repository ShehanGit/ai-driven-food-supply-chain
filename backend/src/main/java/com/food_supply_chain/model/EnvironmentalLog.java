package com.food_supply_chain.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "environmental_logs")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EnvironmentalLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(nullable = false)
    private LocalDateTime timestamp;

    @Column(nullable = false)
    private Double temperature; // Celsius

    @Column(nullable = false)
    private Double humidity; // Percentage

    @Column(nullable = false)
    private String status; // e.g., "SAFE", "ALERT"
}