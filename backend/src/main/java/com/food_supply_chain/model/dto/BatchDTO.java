package com.food_supply_chain.model.dto;

import com.food_supply_chain.model.Batch;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BatchDTO {
    private Long id;
    private String batchCode;
    private Long productId;
    private String productName;
    private Integer quantity;
    private LocalDate productionDate;
    private LocalDate expirationDate;
    private String status;
    private String qrCodeUrl;
    private LocalDateTime createdAt;
    private String createdByUsername;
    private String notes;
    private List<BatchEventDTO> events;
}