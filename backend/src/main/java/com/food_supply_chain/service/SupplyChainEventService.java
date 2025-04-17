package com.food_supply_chain.service;

import com.food_supply_chain.exception.ResourceNotFoundException;
import com.food_supply_chain.mapper.SupplyChainEventMapper;
import com.food_supply_chain.model.Batch;
import com.food_supply_chain.model.SupplyChainEvent;
import com.food_supply_chain.model.User;
import com.food_supply_chain.model.dto.SupplyChainEventDTO;
import com.food_supply_chain.repository.BatchRepository;
import com.food_supply_chain.repository.SupplyChainEventRepository;
import com.food_supply_chain.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SupplyChainEventService {
    private final SupplyChainEventRepository eventRepository;
    private final BatchRepository batchRepository;
    private final UserRepository userRepository;
    private final SupplyChainEventMapper eventMapper;
    private final NotificationService notificationService;

    @Autowired
    public SupplyChainEventService(
            SupplyChainEventRepository eventRepository,
            BatchRepository batchRepository,
            UserRepository userRepository,
            SupplyChainEventMapper eventMapper,
            NotificationService notificationService) {
        this.eventRepository = eventRepository;
        this.batchRepository = batchRepository;
        this.userRepository = userRepository;
        this.eventMapper = eventMapper;
        this.notificationService = notificationService;
    }

    @Transactional
    public SupplyChainEventDTO createEvent(SupplyChainEventDTO eventDTO) {
        // Get the current user
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User initiatedBy = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Get the batch
        Batch batch = null;
        if (eventDTO.getBatchId() != null) {
            batch = batchRepository.findById(eventDTO.getBatchId())
                    .orElseThrow(() -> new ResourceNotFoundException("Batch not found"));
        } else if (eventDTO.getBatchCode() != null && !eventDTO.getBatchCode().isEmpty()) {
            batch = batchRepository.findByBatchCode(eventDTO.getBatchCode())
                    .orElseThrow(() -> new ResourceNotFoundException("Batch not found with code: " + eventDTO.getBatchCode()));
        } else {
            throw new IllegalArgumentException("Either batchId or batchCode must be provided");
        }

        // Get the receiving user if specified
        User receivedBy = null;
        if (eventDTO.getReceivedByUsername() != null && !eventDTO.getReceivedByUsername().isEmpty()) {
            receivedBy = userRepository.findByUsername(eventDTO.getReceivedByUsername())
                    .orElseThrow(() -> new ResourceNotFoundException("Receiving user not found"));
        }

        // Create the event
        SupplyChainEvent event = eventMapper.toEntity(eventDTO, batch, initiatedBy, receivedBy);

        // Save the event
        SupplyChainEvent savedEvent = eventRepository.save(event);

        // Store the old status before updating
        Batch.BatchStatus oldStatus = batch.getStatus();

        // Update batch status based on event type (if applicable)
        updateBatchStatus(batch, event.getEventType());

        // Notify relevant parties about the event
        notificationService.createEventNotification(
                savedEvent,
                "A new " + event.getEventType() + " event has been created for batch " + batch.getBatchCode()
        );

        // Notify about batch status change if it changed
        if (oldStatus != batch.getStatus()) {
            List<User> usersToNotify = new ArrayList<>();
            usersToNotify.add(batch.getCreatedBy()); // Always notify the creator

            // For certain status changes, notify other users
            if (batch.getStatus() == Batch.BatchStatus.IN_TRANSIT ||
                    batch.getStatus() == Batch.BatchStatus.DELIVERED) {
                // Find distributors in the same geographic area
                // This is a simplified approach - in a real application, you would have more
                // sophisticated logic to determine which users should be notified
                List<User> distributors = userRepository.findByRole(User.Role.DISTRIBUTOR);
                usersToNotify.addAll(distributors);
            }

            if (batch.getStatus() == Batch.BatchStatus.AT_RETAILER) {
                // Notify retailers
                List<User> retailers = userRepository.findByRole(User.Role.RETAILER);
                usersToNotify.addAll(retailers);
            }

            notificationService.createBatchStatusNotification(
                    batch.getId(),
                    batch.getBatchCode(),
                    oldStatus.name(),
                    batch.getStatus().name(),
                    usersToNotify
            );
        }

        // Check for quality issues
        if (event.getEventType() == SupplyChainEvent.EventType.QUALITY_CHECKED) {
            // This is a simplified approach - in a real application, you would have
            // more sophisticated logic to determine if there are quality issues
            if (event.getNotes() != null && event.getNotes().toLowerCase().contains("issue")) {
                List<User> usersToNotify = new ArrayList<>();
                usersToNotify.add(batch.getCreatedBy());

                notificationService.createQualityIssueNotification(
                        batch.getId(),
                        batch.getBatchCode(),
                        event.getNotes(),
                        usersToNotify
                );
            }
        }

        return eventMapper.toDTO(savedEvent);
    }

    @Transactional(readOnly = true)
    public SupplyChainEventDTO getEvent(Long id) {
        SupplyChainEvent event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));
        return eventMapper.toDTO(event);
    }

    @Transactional(readOnly = true)
    public List<SupplyChainEventDTO> getEventsByBatch(Long batchId) {
        Batch batch = batchRepository.findById(batchId)
                .orElseThrow(() -> new ResourceNotFoundException("Batch not found"));

        return eventRepository.findByBatchOrderByTimestampDesc(batch)
                .stream()
                .map(eventMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<SupplyChainEventDTO> getEventsByBatchCode(String batchCode) {
        Batch batch = batchRepository.findByBatchCode(batchCode)
                .orElseThrow(() -> new ResourceNotFoundException("Batch not found with code: " + batchCode));

        return eventRepository.findByBatchOrderByTimestampDesc(batch)
                .stream()
                .map(eventMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<SupplyChainEventDTO> getEventsByProductId(Long productId) {
        return eventRepository.findByProductId(productId)
                .stream()
                .map(eventMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<SupplyChainEventDTO> getEventsByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return eventRepository.findByDateRange(startDate, endDate)
                .stream()
                .map(eventMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Page<SupplyChainEventDTO> getEventsByUserInvolved(Long userId, Pageable pageable) {
        return eventRepository.findByUserInvolved(userId, pageable)
                .map(eventMapper::toDTO);
    }

    @Transactional(readOnly = true)
    public List<SupplyChainEventDTO> getEventsByCurrentUser(User.Role role) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Depending on the role, get events where the user is initiator or receiver
        if (role == User.Role.FARMER || role == User.Role.ADMIN) {
            return eventRepository.findByInitiatedBy(user)
                    .stream()
                    .map(eventMapper::toDTO)
                    .collect(Collectors.toList());
        } else if (role == User.Role.DISTRIBUTOR || role == User.Role.RETAILER) {
            return eventRepository.findByReceivedBy(user)
                    .stream()
                    .map(eventMapper::toDTO)
                    .collect(Collectors.toList());
        } else {
            throw new AccessDeniedException("Unauthorized access to events");
        }
    }

    @Transactional
    public SupplyChainEventDTO updateEvent(Long id, SupplyChainEventDTO eventDTO) {
        SupplyChainEvent existingEvent = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));

        // Verify current user has permission to update this event
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        if (!existingEvent.getInitiatedBy().getUsername().equals(username)) {
            throw new AccessDeniedException("You can only update events you initiated");
        }

        // Update mutable fields
        if (eventDTO.getLocation() != null) {
            existingEvent.setLocation(eventDTO.getLocation());
        }

        if (eventDTO.getGeoCoordinates() != null) {
            existingEvent.setGeoCoordinates(eventDTO.getGeoCoordinates());
        }

        if (eventDTO.getTemperature() != null) {
            existingEvent.setTemperature(eventDTO.getTemperature());
        }

        if (eventDTO.getHumidity() != null) {
            existingEvent.setHumidity(eventDTO.getHumidity());
        }

        if (eventDTO.getNotes() != null) {
            existingEvent.setNotes(eventDTO.getNotes());
        }

        if (eventDTO.getBlockchainTxHash() != null) {
            existingEvent.setBlockchainTxHash(eventDTO.getBlockchainTxHash());
        }

        if (eventDTO.getAdditionalData() != null) {
            existingEvent.setAdditionalDataMap(eventDTO.getAdditionalData());
        }

        SupplyChainEvent updatedEvent = eventRepository.save(existingEvent);

        // Check for quality issues in updated event
        if (existingEvent.getEventType() == SupplyChainEvent.EventType.QUALITY_CHECKED) {
            if (eventDTO.getNotes() != null && eventDTO.getNotes().toLowerCase().contains("issue")) {
                List<User> usersToNotify = new ArrayList<>();
                usersToNotify.add(existingEvent.getBatch().getCreatedBy());

                notificationService.createQualityIssueNotification(
                        existingEvent.getBatch().getId(),
                        existingEvent.getBatch().getBatchCode(),
                        eventDTO.getNotes(),
                        usersToNotify
                );
            }
        }

        return eventMapper.toDTO(updatedEvent);
    }

    private void updateBatchStatus(Batch batch, SupplyChainEvent.EventType eventType) {
        // Map event types to batch statuses
        Batch.BatchStatus oldStatus = batch.getStatus();

        switch (eventType) {
            case HARVESTED:
                batch.setStatus(Batch.BatchStatus.HARVESTED);
                break;
            case PACKAGED:
                // No direct mapping, keep current status
                break;
            case QUALITY_CHECKED:
                // No direct mapping, keep current status
                break;
            case STORED:
                batch.setStatus(Batch.BatchStatus.IN_STORAGE);
                break;
            case SHIPPED:
                batch.setStatus(Batch.BatchStatus.IN_TRANSIT);
                break;
            case RECEIVED:
                batch.setStatus(Batch.BatchStatus.DELIVERED);
                break;
            case DELIVERED_TO_RETAILER:
                batch.setStatus(Batch.BatchStatus.AT_RETAILER);
                break;
            case SOLD:
                batch.setStatus(Batch.BatchStatus.SOLD);
                break;
            case RECALLED:
                batch.setStatus(Batch.BatchStatus.RECALLED);
                break;
            default:
                // For other event types, don't change batch status
                return;
        }

        // Only save if status changed
        if (oldStatus != batch.getStatus()) {
            batchRepository.save(batch);
        }
    }
}