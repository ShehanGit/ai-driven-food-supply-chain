package com.food_supply_chain.controller;

import com.food_supply_chain.exception.ResourceNotFoundException;
import com.food_supply_chain.model.dto.BatchDTO;
import com.food_supply_chain.model.dto.BatchEventDTO;
import com.food_supply_chain.model.dto.ProductDTO;
import com.food_supply_chain.service.BatchService;
import com.food_supply_chain.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/public")
public class PublicProductController {

    private final ProductService productService;
    private final BatchService batchService;

    @Autowired
    public PublicProductController(ProductService productService, BatchService batchService) {
        this.productService = productService;
        this.batchService = batchService;
    }

    /**
     * Get product information by batch code (for QR code scanning)
     */
    @GetMapping("/product/batch/{batchCode}")
    public ResponseEntity<ProductDTO> getProductByBatchCode(@PathVariable String batchCode) {
        return ResponseEntity.ok(productService.getProductByBatchCode(batchCode));
    }

    /**
     * Get batch information by batch code (for QR code scanning)
     */
    @GetMapping("/batch/{batchCode}")
    public ResponseEntity<BatchDTO> getBatchByCode(@PathVariable String batchCode) {
        return ResponseEntity.ok(batchService.getBatchByCode(batchCode));
    }

    /**
     * Get batch events by batch code (for tracking journey)
     */
    @GetMapping("/batch/{batchCode}/events")
    public ResponseEntity<List<BatchEventDTO>> getBatchEventsByCode(@PathVariable String batchCode) {
        BatchDTO batch = batchService.getBatchByCode(batchCode);
        return ResponseEntity.ok(batchService.getBatchEvents(batch.getId()));
    }

    /**
     * Get complete product journey by batch code
     */
    @GetMapping("/journey/{batchCode}")
    public ResponseEntity<Map<String, Object>> getProductJourney(@PathVariable String batchCode) {
        Map<String, Object> journey = new HashMap<>();

        try {
            // First get batch information by batch code
            BatchDTO batch = batchService.getBatchByCode(batchCode);
            journey.put("batch", batch);

            // Then use the productId from the batch to get product information
            ProductDTO product = productService.getProduct(batch.getProductId());
            journey.put("product", product);

            // Get batch events for journey tracking
            List<BatchEventDTO> events = batchService.getBatchEvents(batch.getId());
            journey.put("events", events);

            return ResponseEntity.ok(journey);
        } catch (ResourceNotFoundException e) {
            throw new ResourceNotFoundException("No journey found for batch code: " + batchCode);
        }
    }

    /**
     * Search for products (basic public search functionality)
     */
    @GetMapping("/products/search")
    public ResponseEntity<List<ProductDTO>> searchProducts(@RequestParam String keyword) {
        return ResponseEntity.ok(productService.searchProducts(keyword));
    }

    /**
     * Get products by type for public browsing
     */
    @GetMapping("/products/type/{productType}")
    public ResponseEntity<List<ProductDTO>> getProductsByType(@PathVariable String productType) {
        return ResponseEntity.ok(productService.getProductsByType(productType));
    }

    /**
     * Get organic products for public browsing
     */
    @GetMapping("/products/organic")
    public ResponseEntity<List<ProductDTO>> getOrganicProducts() {
        return ResponseEntity.ok(productService.getOrganicProducts());
    }
}