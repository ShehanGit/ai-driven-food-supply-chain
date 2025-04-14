package com.food_supply_chain.service;

import com.food_supply_chain.model.Product;
import com.food_supply_chain.model.User;
import com.food_supply_chain.model.dto.ProductDTO;
import com.food_supply_chain.repository.ProductRepository;
import com.food_supply_chain.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductService {
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final JwtService jwtService;

    @Autowired
    public ProductService(ProductRepository productRepository, UserRepository userRepository, JwtService jwtService) {
        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }

    public ProductDTO createProduct(ProductDTO productDTO) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Product product = new Product();
        product.setBatchCode(productDTO.getBatchCode() != null ? productDTO.getBatchCode() : generateBatchCode());
        product.setName(productDTO.getName());
        product.setDescription(productDTO.getDescription());
        product.setPrice(productDTO.getPrice());
        product.setStock(productDTO.getStock());
        product.setCreatedBy(user);
        // createdAt is set automatically by @PrePersist

        Product savedProduct = productRepository.save(product);
        return mapToDTO(savedProduct);
    }

    public ProductDTO getProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        return mapToDTO(product);
    }

    public List<ProductDTO> getProductsByCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return productRepository.findByCreatedBy(user)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public ProductDTO updateProduct(Long id, ProductDTO productDTO) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        if (!product.getCreatedBy().getUsername().equals(username)) {
            throw new RuntimeException("You can only update your own products");
        }

        product.setBatchCode(productDTO.getBatchCode() != null ? productDTO.getBatchCode() : product.getBatchCode());
        product.setName(productDTO.getName());
        product.setDescription(productDTO.getDescription());
        product.setPrice(productDTO.getPrice());
        product.setStock(productDTO.getStock());
        // createdAt is not updated (updatable = false)

        Product updatedProduct = productRepository.save(product);
        return mapToDTO(updatedProduct);
    }

    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        if (!product.getCreatedBy().getUsername().equals(username)) {
            throw new RuntimeException("You can only delete your own products");
        }

        productRepository.delete(product);
    }

    private ProductDTO mapToDTO(Product product) {
        return new ProductDTO(
                product.getId(),
                product.getBatchCode(),
                product.getName(),
                product.getDescription(),
                product.getPrice(),
                product.getStock(),
                product.getCreatedBy().getUsername(),
                product.getCreatedAt() // Include createdAt in DTO
        );
    }

    private String generateBatchCode() {
        return "BATCH-" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
    }
}