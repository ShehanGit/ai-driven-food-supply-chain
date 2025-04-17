package com.food_supply_chain.mapper;

import com.food_supply_chain.model.Batch;
import com.food_supply_chain.model.BatchEvent;
import com.food_supply_chain.model.dto.BatchDTO;
import com.food_supply_chain.model.dto.BatchEventDTO;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class BatchMapper {

    public BatchDTO toDTO(Batch batch) {
        if (batch == null) {
            return null;
        }

        List<BatchEventDTO> eventDTOs = null;
        if (batch.getEvents() != null && !batch.getEvents().isEmpty()) {
            eventDTOs = batch.getEvents().stream()
                    .map(this::toEventDTO)
                    .collect(Collectors.toList());
        }

        return new BatchDTO(
                batch.getId(),
                batch.getBatchCode(),
                batch.getProduct().getId(),
                batch.getProduct().getName(),
                batch.getQuantity(),
                batch.getProductionDate(),
                batch.getExpirationDate(),
                batch.getStatus().name(),
                batch.getQrCodeUrl(),
                batch.getCreatedAt(),
                batch.getCreatedBy().getUsername(),
                batch.getNotes(),
                eventDTOs
        );
    }

    public BatchEventDTO toEventDTO(BatchEvent event) {
        if (event == null) {
            return null;
        }

        return new BatchEventDTO(
                event.getId(),
                event.getBatch().getId(),
                event.getRecordedBy().getUsername(),
                event.getTimestamp(),
                event.getEventType().name(),
                event.getLocation(),
                event.getTemperature(),
                event.getHumidity(),
                event.getNotes(),
                event.getBlockchainTxHash()
        );
    }

    public BatchEvent toEventEntity(BatchEventDTO dto, Batch batch) {
        if (dto == null) {
            return null;
        }

        BatchEvent event = new BatchEvent();
        event.setBatch(batch);
        // recordedBy is set in service
        event.setTimestamp(dto.getTimestamp() != null ? dto.getTimestamp() : java.time.LocalDateTime.now());
        event.setEventType(BatchEvent.EventType.valueOf(dto.getEventType()));
        event.setLocation(dto.getLocation());
        event.setTemperature(dto.getTemperature());
        event.setHumidity(dto.getHumidity());
        event.setNotes(dto.getNotes());
        event.setBlockchainTxHash(dto.getBlockchainTxHash());

        return event;
    }

    // Note: We don't have a complete toEntity method for Batch because
    // it requires setting the Product and User entities, which is better handled in the service
}