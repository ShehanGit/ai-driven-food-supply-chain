package com.food_supply_chain.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BatchEventDTO {
    private Long id;
    private Long batchId;
    private String recordedByUsername;
    private LocalDateTime timestamp;
    private String eventType;
    private String location;
    private Double temperature;
    private Double humidity;
    private String notes;
    private String blockchainTxHash;
}