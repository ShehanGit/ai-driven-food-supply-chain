package com.food_supply_chain.controller;

import com.food_supply_chain.model.dto.BatchDTO;
import com.food_supply_chain.model.dto.BatchEventDTO;
import com.food_supply_chain.service.BatchService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/batches")
public class BatchController {
    private final BatchService batchService;

    @Autowired
    public BatchController(BatchService batchService) {
        this.batchService = batchService;
    }

    @PostMapping
    public ResponseEntity<BatchDTO> createBatch(@Valid @RequestBody BatchDTO batchDTO) {
        return new ResponseEntity<>(batchService.createBatch(batchDTO), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BatchDTO> getBatch(@PathVariable Long id) {
        return ResponseEntity.ok(batchService.getBatch(id));
    }

    @GetMapping("/code/{batchCode}")
    public ResponseEntity<BatchDTO> getBatchByCode(@PathVariable String batchCode) {
        return ResponseEntity.ok(batchService.getBatchByCode(batchCode));
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<BatchDTO>> getBatchesByProduct(@PathVariable Long productId) {
        return ResponseEntity.ok(batchService.getBatchesByProduct(productId));
    }

    @GetMapping
    public ResponseEntity<List<BatchDTO>> getBatchesByCurrentUser() {
        return ResponseEntity.ok(batchService.getBatchesByCurrentUser());
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<BatchDTO>> getBatchesByStatus(@PathVariable String status) {
        return ResponseEntity.ok(batchService.getBatchesByStatus(status));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<BatchDTO> updateBatchStatus(
            @PathVariable Long id,
            @RequestParam String status,
            @Valid @RequestBody BatchEventDTO eventDTO) {
        return ResponseEntity.ok(batchService.updateBatchStatus(id, status, eventDTO));
    }

    @PostMapping("/{id}/events")
    public ResponseEntity<BatchDTO> addBatchEvent(@PathVariable Long id, @Valid @RequestBody BatchEventDTO eventDTO) {
        return ResponseEntity.ok(batchService.addBatchEvent(id, eventDTO));
    }

    @GetMapping("/{id}/events")
    public ResponseEntity<List<BatchEventDTO>> getBatchEvents(@PathVariable Long id) {
        return ResponseEntity.ok(batchService.getBatchEvents(id));
    }

    @GetMapping("/expiring")
    public ResponseEntity<List<BatchDTO>> getExpiringBatches(@RequestParam(defaultValue = "7") int days) {
        return ResponseEntity.ok(batchService.getExpiringBatches(days));
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<String> handleRuntimeException(RuntimeException ex) {
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.BAD_REQUEST);
    }
}