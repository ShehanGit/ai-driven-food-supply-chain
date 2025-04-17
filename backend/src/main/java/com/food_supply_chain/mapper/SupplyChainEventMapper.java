package com.food_supply_chain.mapper;

import com.food_supply_chain.model.Batch;
import com.food_supply_chain.model.SupplyChainEvent;
import com.food_supply_chain.model.User;
import com.food_supply_chain.model.dto.SupplyChainEventDTO;
import org.springframework.stereotype.Component;

@Component
public class SupplyChainEventMapper {

    public SupplyChainEventDTO toDTO(SupplyChainEvent event) {
        if (event == null) {
            return null;
        }

        SupplyChainEventDTO dto = new SupplyChainEventDTO();
        dto.setId(event.getId());
        dto.setEventType(event.getEventType().name());

        if (event.getBatch() != null) {
            dto.setBatchId(event.getBatch().getId());
            dto.setBatchCode(event.getBatch().getBatchCode());
        }

        if (event.getInitiatedBy() != null) {
            dto.setInitiatedByUsername(event.getInitiatedBy().getUsername());
        }

        if (event.getReceivedBy() != null) {
            dto.setReceivedByUsername(event.getReceivedBy().getUsername());
        }

        dto.setTimestamp(event.getTimestamp());
        dto.setLocation(event.getLocation());
        dto.setGeoCoordinates(event.getGeoCoordinates());
        dto.setTemperature(event.getTemperature());
        dto.setHumidity(event.getHumidity());
        dto.setNotes(event.getNotes());
        dto.setBlockchainTxHash(event.getBlockchainTxHash());
        dto.setAdditionalData(event.getAdditionalDataMap());

        return dto;
    }

    public SupplyChainEvent toEntity(SupplyChainEventDTO dto, Batch batch, User initiatedBy, User receivedBy) {
        if (dto == null) {
            return null;
        }

        SupplyChainEvent event = new SupplyChainEvent();

        if (dto.getId() != null) {
            event.setId(dto.getId());
        }

        event.setEventType(SupplyChainEvent.EventType.valueOf(dto.getEventType()));
        event.setBatch(batch);
        event.setInitiatedBy(initiatedBy);
        event.setReceivedBy(receivedBy);

        if (dto.getTimestamp() != null) {
            event.setTimestamp(dto.getTimestamp());
        }

        event.setLocation(dto.getLocation());
        event.setGeoCoordinates(dto.getGeoCoordinates());
        event.setTemperature(dto.getTemperature());
        event.setHumidity(dto.getHumidity());
        event.setNotes(dto.getNotes());
        event.setBlockchainTxHash(dto.getBlockchainTxHash());

        if (dto.getAdditionalData() != null) {
            event.setAdditionalDataMap(dto.getAdditionalData());
        }

        return event;
    }
}