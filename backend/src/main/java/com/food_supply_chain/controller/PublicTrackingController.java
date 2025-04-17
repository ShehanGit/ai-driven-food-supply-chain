package com.food_supply_chain.controller;

import com.food_supply_chain.model.dto.BatchDTO;
import com.food_supply_chain.model.dto.ProductDTO;
import com.food_supply_chain.model.dto.SupplyChainEventDTO;
import com.food_supply_chain.service.BatchService;
import com.food_supply_chain.service.ProductService;
import com.food_supply_chain.service.SupplyChainEventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/public/tracking")
public class PublicTrackingController {

    private final ProductService productService;
    private final BatchService batchService;
    private final SupplyChainEventService eventService;

    @Autowired
    public PublicTrackingController(
            ProductService productService,
            BatchService batchService,
            SupplyChainEventService eventService) {
        this.productService = productService;
        this.batchService = batchService;
        this.eventService = eventService;
    }

    /**
     * Get complete tracking information for a product by batch code
     */
    @GetMapping("/batch/{batchCode}")
    public ResponseEntity<Map<String, Object>> getProductTracking(@PathVariable String batchCode) {
        Map<String, Object> tracking = new HashMap<>();

        // Get batch information
        BatchDTO batch = batchService.getBatchByCode(batchCode);
        tracking.put("batch", batch);

        // Get product information
        ProductDTO product = productService.getProduct(batch.getProductId());
        tracking.put("product", product);

        // Get events
        List<SupplyChainEventDTO> events = eventService.getEventsByBatchCode(batchCode);
        tracking.put("events", events);

        // Calculate time in transit, time since harvest, etc.
        tracking.put("metrics", calculateMetrics(events, batch));

        return ResponseEntity.ok(tracking);
    }

    /**
     * Get the journey timeline for a batch
     */
    @GetMapping("/timeline/{batchCode}")
    public ResponseEntity<List<SupplyChainEventDTO>> getBatchTimeline(@PathVariable String batchCode) {
        return ResponseEntity.ok(eventService.getEventsByBatchCode(batchCode));
    }

    /**
     * Calculate additional metrics about the product journey
     */
    private Map<String, Object> calculateMetrics(List<SupplyChainEventDTO> events, BatchDTO batch) {
        Map<String, Object> metrics = new HashMap<>();

        if (events.isEmpty()) {
            return metrics;
        }

        // Find the harvest event
        SupplyChainEventDTO harvestEvent = events.stream()
                .filter(e -> "HARVESTED".equals(e.getEventType()))
                .findFirst()
                .orElse(null);

        // Find the most recent event
        SupplyChainEventDTO latestEvent = events.get(0); // Events are already sorted by timestamp desc

        // Calculate days since harvest
        if (harvestEvent != null) {
            long daysSinceHarvest = java.time.Duration.between(
                    harvestEvent.getTimestamp(),
                    java.time.LocalDateTime.now()).toDays();
            metrics.put("daysSinceHarvest", daysSinceHarvest);
        }

        // Calculate time in transit if applicable
        SupplyChainEventDTO shippedEvent = events.stream()
                .filter(e -> "SHIPPED".equals(e.getEventType()))
                .findFirst()
                .orElse(null);

        SupplyChainEventDTO receivedEvent = events.stream()
                .filter(e -> "RECEIVED".equals(e.getEventType()))
                .findFirst()
                .orElse(null);

        if (shippedEvent != null && receivedEvent != null) {
            long hoursInTransit = java.time.Duration.between(
                    shippedEvent.getTimestamp(),
                    receivedEvent.getTimestamp()).toHours();
            metrics.put("hoursInTransit", hoursInTransit);
        }

        // Count the number of quality checks
        long qualityChecks = events.stream()
                .filter(e -> "QUALITY_CHECKED".equals(e.getEventType()))
                .count();
        metrics.put("qualityChecks", qualityChecks);

        // Calculate carbon footprint estimation (simplified)
        double estimatedCarbonFootprint = calculateEstimatedCarbonFootprint(events);
        metrics.put("estimatedCarbonFootprint", estimatedCarbonFootprint);

        return metrics;
    }

    /**
     * Simplified carbon footprint calculation based on transport distance and conditions
     */
    private double calculateEstimatedCarbonFootprint(List<SupplyChainEventDTO> events) {
        double baseCarbonFootprint = 10.0; // Base carbon footprint in kg CO2

        // This is a simplified placeholder calculation
        // In a real implementation, you would consider:
        // - Distance between locations (which would require geocoding)
        // - Type of transport used
        // - Energy efficiency of storage
        // - Farming practices

        return baseCarbonFootprint * Math.max(1, events.size() / 2.0);
    }
}