package com.food_supply_chain.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Entity
@Table(name = "supply_chain_events")
@Data
public class SupplyChainEvent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "event_type", nullable = false)
    @Enumerated(EnumType.STRING)
    private EventType eventType;

    @ManyToOne
    @JoinColumn(name = "batch_id")
    private Batch batch;

    @ManyToOne
    @JoinColumn(name = "initiated_by_id", nullable = false)
    private User initiatedBy;

    @ManyToOne
    @JoinColumn(name = "received_by_id")
    private User receivedBy;

    @Column(name = "timestamp", nullable = false)
    private LocalDateTime timestamp;

    @Column(name = "location", length = 500)
    private String location;

    @Column(name = "geo_coordinates", length = 100)
    private String geoCoordinates;

    @Column(name = "temperature")
    private Double temperature;

    @Column(name = "humidity")
    private Double humidity;

    @Column(name = "notes", length = 1000)
    private String notes;

    @Column(name = "blockchain_tx_hash")
    private String blockchainTxHash;

    @Column(name = "additional_data", columnDefinition = "TEXT")
    private String additionalData; // Stored as JSON

    public enum EventType {
        CREATED,
        HARVESTED,
        PACKAGED,
        QUALITY_CHECKED,
        CERTIFIED,
        STORED,
        SHIPPED,
        IN_TRANSIT,
        RECEIVED,
        PROCESSED,
        DISTRIBUTED,
        DELIVERED_TO_RETAILER,
        STOCKED,
        SOLD,
        RECALLED,
        DISPOSED
    }

    @PrePersist
    protected void onCreate() {
        this.timestamp = LocalDateTime.now();
    }

    // Helper methods for additional data
    public void setAdditionalDataField(String key, String value) {
        Map<String, String> dataMap = getAdditionalDataMap();
        dataMap.put(key, value);
        setAdditionalDataMap(dataMap);
    }

    public String getAdditionalDataField(String key) {
        return getAdditionalDataMap().get(key);
    }

    public Map<String, String> getAdditionalDataMap() {
        if (additionalData == null || additionalData.isEmpty()) {
            return new HashMap<>();
        }
        try {
            return new com.fasterxml.jackson.databind.ObjectMapper().readValue(
                    additionalData,
                    new com.fasterxml.jackson.core.type.TypeReference<HashMap<String, String>>() {});
        } catch (Exception e) {
            return new HashMap<>();
        }
    }

    public void setAdditionalDataMap(Map<String, String> dataMap) {
        try {
            this.additionalData = new com.fasterxml.jackson.databind.ObjectMapper().writeValueAsString(dataMap);
        } catch (Exception e) {
            this.additionalData = "{}";
        }
    }
}