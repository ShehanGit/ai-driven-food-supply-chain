package com.food_supply_chain.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SupplyChainEventDTO {
    private Long id;
    private String eventType;
    private Long batchId;
    private String batchCode;
    private String initiatedByUsername;
    private String receivedByUsername;
    private LocalDateTime timestamp;
    private String location;
    private String geoCoordinates;
    private Double temperature;
    private Double humidity;
    private String notes;
    private String blockchainTxHash;
    private Map<String, String> additionalData;
}