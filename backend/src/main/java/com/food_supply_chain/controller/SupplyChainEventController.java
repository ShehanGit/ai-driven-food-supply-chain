package com.food_supply_chain.controller;

import com.food_supply_chain.model.User;
import com.food_supply_chain.model.dto.SupplyChainEventDTO;
import com.food_supply_chain.service.SupplyChainEventService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/events")
public class SupplyChainEventController {
    private final SupplyChainEventService eventService;

    @Autowired
    public SupplyChainEventController(SupplyChainEventService eventService) {
        this.eventService = eventService;
    }

    @PostMapping
    public ResponseEntity<SupplyChainEventDTO> createEvent(@Valid @RequestBody SupplyChainEventDTO eventDTO) {
        return new ResponseEntity<>(eventService.createEvent(eventDTO), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SupplyChainEventDTO> getEvent(@PathVariable Long id) {
        return ResponseEntity.ok(eventService.getEvent(id));
    }

    @GetMapping("/batch/{batchId}")
    public ResponseEntity<List<SupplyChainEventDTO>> getEventsByBatch(@PathVariable Long batchId) {
        return ResponseEntity.ok(eventService.getEventsByBatch(batchId));
    }

    @GetMapping("/batch/code/{batchCode}")
    public ResponseEntity<List<SupplyChainEventDTO>> getEventsByBatchCode(@PathVariable String batchCode) {
        return ResponseEntity.ok(eventService.getEventsByBatchCode(batchCode));
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<SupplyChainEventDTO>> getEventsByProductId(@PathVariable Long productId) {
        return ResponseEntity.ok(eventService.getEventsByProductId(productId));
    }

    @GetMapping("/dateRange")
    public ResponseEntity<List<SupplyChainEventDTO>> getEventsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        return ResponseEntity.ok(eventService.getEventsByDateRange(startDate, endDate));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<Page<SupplyChainEventDTO>> getEventsByUserInvolved(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "timestamp") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDir) {

        Sort.Direction direction = sortDir.equalsIgnoreCase("DESC") ? Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));

        return ResponseEntity.ok(eventService.getEventsByUserInvolved(userId, pageable));
    }

    @GetMapping("/myEvents/{role}")
    public ResponseEntity<List<SupplyChainEventDTO>> getEventsByCurrentUser(@PathVariable String role) {
        User.Role userRole = User.Role.valueOf(role.toUpperCase());
        return ResponseEntity.ok(eventService.getEventsByCurrentUser(userRole));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SupplyChainEventDTO> updateEvent(
            @PathVariable Long id,
            @Valid @RequestBody SupplyChainEventDTO eventDTO) {
        return ResponseEntity.ok(eventService.updateEvent(id, eventDTO));
    }
}