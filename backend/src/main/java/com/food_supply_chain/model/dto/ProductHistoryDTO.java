package com.food_supply_chain.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductHistoryDTO {
    private Long productId;
    private String name;
    private String batchCode;
    private List<EventDTO> events;
    private Double carbonFootprint;
    private List<EnvironmentalLogDTO> environmentalLogs;
}