package com.food_supply_chain.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "batch_events")
@Data
public class BatchEvent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "batch_id", nullable = false)
    private Batch batch;

    @ManyToOne
    @JoinColumn(name = "recorded_by_id", nullable = false)
    private User recordedBy;

    @Column(name = "timestamp", nullable = false)
    private LocalDateTime timestamp;

    @Column(name = "event_type", nullable = false)
    @Enumerated(EnumType.STRING)
    private EventType eventType;

    @Column(name = "location", length = 500)
    private String location;

    @Column(name = "temperature")
    private Double temperature; // in Celsius

    @Column(name = "humidity")
    private Double humidity; // percentage

    @Column(name = "notes", length = 1000)
    private String notes;

    @Column(name = "blockchain_tx_hash")
    private String blockchainTxHash;

    public enum EventType {
        CREATED,
        HARVESTED,
        STORED,
        SHIPPED,
        RECEIVED,
        QUALITY_CHECK,
        PROCESSED,
        PACKAGED,
        DELIVERED,
        SOLD,
        RECALLED
    }

    @PrePersist
    protected void onCreate() {
        this.timestamp = LocalDateTime.now();
    }
}