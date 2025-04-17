package com.food_supply_chain.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductEnvironmentalConditionDTO {
    private Long id;
    private Long productId;
    private LocalDateTime timestamp;
    private Double temperature;
    private Double humidity;
    private Double lightExposure;
    private Double soilMoisture;
    private Double soilPh;
    private Double airQuality;
    private String recordedBy;
    private String location;
    private String notes;
}