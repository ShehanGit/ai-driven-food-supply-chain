package com.food_supply_chain.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DemandForecastDTO {
    private Long productId;
    private Map<String, Double> forecast; // e.g., {"2025-04": 100.5, "2025-05": 120.0}
}