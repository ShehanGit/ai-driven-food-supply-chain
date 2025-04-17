package com.food_supply_chain.mapper;

import com.food_supply_chain.model.Product;
import com.food_supply_chain.model.ProductEnvironmentalCondition;
import com.food_supply_chain.model.dto.ProductDTO;
import com.food_supply_chain.model.dto.ProductEnvironmentalConditionDTO;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class ProductMapper {

    public ProductDTO toDTO(Product product) {
        if (product == null) {
            return null;
        }

        List<ProductEnvironmentalConditionDTO> environmentalConditions = null;
        if (product.getEnvironmentalConditions() != null && !product.getEnvironmentalConditions().isEmpty()) {
            environmentalConditions = product.getEnvironmentalConditions().stream()
                    .map(this::toEnvironmentalConditionDTO)
                    .collect(Collectors.toList());
        }

        return new ProductDTO(
                product.getId(),
                product.getBatchCode(),
                product.getName(),
                product.getDescription(),
                product.getPrice(),
                product.getStock(),
                product.getCreatedBy().getUsername(),
                product.getCreatedAt(),
                product.getHarvestDate(),
                product.getExpirationDate(),
                product.getProductType(),
                product.getOrganic(),
                product.getCertification(),
                product.getCultivationMethod(),
                product.getQrCodeUrl(),
                product.getImageUrl(),
                environmentalConditions
        );
    }

    public Product toEntity(ProductDTO productDTO) {
        if (productDTO == null) {
            return null;
        }

        Product product = new Product();

        product.setBatchCode(productDTO.getBatchCode());
        product.setName(productDTO.getName());
        product.setDescription(productDTO.getDescription());
        product.setPrice(productDTO.getPrice());
        product.setStock(productDTO.getStock());
        // createdBy is set in the service
        product.setHarvestDate(productDTO.getHarvestDate());
        product.setExpirationDate(productDTO.getExpirationDate());
        product.setProductType(productDTO.getProductType());
        product.setOrganic(productDTO.getOrganic());
        product.setCertification(productDTO.getCertification());
        product.setCultivationMethod(productDTO.getCultivationMethod());
        product.setQrCodeUrl(productDTO.getQrCodeUrl());
        product.setImageUrl(productDTO.getImageUrl());

        // Environmental conditions are set separately

        return product;
    }

    public void updateEntity(Product product, ProductDTO productDTO) {
        if (product == null || productDTO == null) {
            return;
        }

        if (productDTO.getName() != null) {
            product.setName(productDTO.getName());
        }

        if (productDTO.getDescription() != null) {
            product.setDescription(productDTO.getDescription());
        }

        if (productDTO.getPrice() != null) {
            product.setPrice(productDTO.getPrice());
        }

        if (productDTO.getStock() != null) {
            product.setStock(productDTO.getStock());
        }

        if (productDTO.getHarvestDate() != null) {
            product.setHarvestDate(productDTO.getHarvestDate());
        }

        if (productDTO.getExpirationDate() != null) {
            product.setExpirationDate(productDTO.getExpirationDate());
        }

        if (productDTO.getProductType() != null) {
            product.setProductType(productDTO.getProductType());
        }

        if (productDTO.getOrganic() != null) {
            product.setOrganic(productDTO.getOrganic());
        }

        if (productDTO.getCertification() != null) {
            product.setCertification(productDTO.getCertification());
        }

        if (productDTO.getCultivationMethod() != null) {
            product.setCultivationMethod(productDTO.getCultivationMethod());
        }

        if (productDTO.getQrCodeUrl() != null) {
            product.setQrCodeUrl(productDTO.getQrCodeUrl());
        }

        if (productDTO.getImageUrl() != null) {
            product.setImageUrl(productDTO.getImageUrl());
        }
    }

    public ProductEnvironmentalConditionDTO toEnvironmentalConditionDTO(ProductEnvironmentalCondition condition) {
        if (condition == null) {
            return null;
        }

        return new ProductEnvironmentalConditionDTO(
                condition.getId(),
                condition.getProduct().getId(),
                condition.getTimestamp(),
                condition.getTemperature(),
                condition.getHumidity(),
                condition.getLightExposure(),
                condition.getSoilMoisture(),
                condition.getSoilPh(),
                condition.getAirQuality(),
                condition.getRecordedBy(),
                condition.getLocation(),
                condition.getNotes()
        );
    }

    public ProductEnvironmentalCondition toEnvironmentalConditionEntity(ProductEnvironmentalConditionDTO dto, Product product) {
        if (dto == null) {
            return null;
        }

        ProductEnvironmentalCondition condition = new ProductEnvironmentalCondition();

        condition.setProduct(product);
        condition.setTimestamp(dto.getTimestamp() != null ? dto.getTimestamp() : java.time.LocalDateTime.now());
        condition.setTemperature(dto.getTemperature());
        condition.setHumidity(dto.getHumidity());
        condition.setLightExposure(dto.getLightExposure());
        condition.setSoilMoisture(dto.getSoilMoisture());
        condition.setSoilPh(dto.getSoilPh());
        condition.setAirQuality(dto.getAirQuality());
        condition.setRecordedBy(dto.getRecordedBy());
        condition.setLocation(dto.getLocation());
        condition.setNotes(dto.getNotes());

        return condition;
    }
}