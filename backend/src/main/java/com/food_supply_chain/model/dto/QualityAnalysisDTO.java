package com.food_supply_chain.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class QualityAnalysisDTO {
    private Long productId;
    private String qualityStatus; // e.g., "Good", "Defective"
    private String details; // e.g., "Ripe", "Spotted"
}