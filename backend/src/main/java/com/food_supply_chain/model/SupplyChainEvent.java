package com.food_supply_chain.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "supply_chain_events")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SupplyChainEvent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(name = "event_type", nullable = false)
    private EventType eventType; // HARVEST, SHIP, DELIVER

    @Column(nullable = false)
    private LocalDateTime timestamp;

    @Column(nullable = false)
    private String location; // e.g., "Farm A", "Warehouse B"

    @Column(columnDefinition = "jsonb") // PostgreSQL JSONB for flexibility
    private String conditions; // e.g., {"temp": 5, "humidity": 80}

    @Column(name = "blockchain_tx_hash")
    private String blockchainTxHash; // Hash from Ethereum
}

enum EventType {
    HARVEST, SHIP, DELIVER
}