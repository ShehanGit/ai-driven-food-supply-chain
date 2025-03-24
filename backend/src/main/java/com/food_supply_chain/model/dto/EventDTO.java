package com.food_supply_chain.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EventDTO {
    private Long id;
    private Long productId;
    private Long userId;
    private String eventType; // HARVEST, SHIP, DELIVER
    private LocalDateTime timestamp;
    private String location;
    private String conditions; // JSON string
    private String blockchainTxHash;
}