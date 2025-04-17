package com.food_supply_chain.controller;

import com.food_supply_chain.model.dto.ProductDTO;
import com.food_supply_chain.model.dto.ProductEnvironmentalConditionDTO;
import com.food_supply_chain.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {
    private final ProductService productService;

    @Autowired
    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @PostMapping
    public ResponseEntity<ProductDTO> createProduct(@Valid @RequestBody ProductDTO productDTO) {
        return new ResponseEntity<>(productService.createProduct(productDTO), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductDTO> getProduct(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProduct(id));
    }

    @GetMapping("/batch/{batchCode}")
    public ResponseEntity<ProductDTO> getProductByBatchCode(@PathVariable String batchCode) {
        return ResponseEntity.ok(productService.getProductByBatchCode(batchCode));
    }

    @GetMapping
    public ResponseEntity<List<ProductDTO>> getProductsByCurrentUser() {
        return ResponseEntity.ok(productService.getProductsByCurrentUser());
    }

    @GetMapping("/paged")
    public ResponseEntity<Page<ProductDTO>> getProductsByCurrentUserPaged(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDir,
            @RequestParam(required = false) String search) {

        Sort.Direction direction = sortDir.equalsIgnoreCase("DESC") ? Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));

        return ResponseEntity.ok(productService.getProductsByCurrentUser(pageable, search));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductDTO> updateProduct(@PathVariable Long id, @Valid @RequestBody ProductDTO productDTO) {
        return ResponseEntity.ok(productService.updateProduct(id, productDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/environmental-conditions")
    public ResponseEntity<ProductDTO> addEnvironmentalCondition(
            @PathVariable Long id,
            @Valid @RequestBody ProductEnvironmentalConditionDTO conditionDTO) {
        return ResponseEntity.ok(productService.addEnvironmentalCondition(id, conditionDTO));
    }

    @GetMapping("/{id}/environmental-conditions")
    public ResponseEntity<List<ProductEnvironmentalConditionDTO>> getProductEnvironmentalConditions(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductEnvironmentalConditions(id));
    }

    @GetMapping("/search")
    public ResponseEntity<List<ProductDTO>> searchProducts(@RequestParam String keyword) {
        return ResponseEntity.ok(productService.searchProducts(keyword));
    }

    @GetMapping("/type/{productType}")
    public ResponseEntity<List<ProductDTO>> getProductsByType(@PathVariable String productType) {
        return ResponseEntity.ok(productService.getProductsByType(productType));
    }

    @GetMapping("/organic")
    public ResponseEntity<List<ProductDTO>> getOrganicProducts() {
        return ResponseEntity.ok(productService.getOrganicProducts());
    }

    @GetMapping("/expiring")
    public ResponseEntity<List<ProductDTO>> getExpiringProducts(@RequestParam(defaultValue = "7") int days) {
        return ResponseEntity.ok(productService.getExpiringProducts(days));
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<String> handleRuntimeException(RuntimeException ex) {
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.BAD_REQUEST);
    }
}