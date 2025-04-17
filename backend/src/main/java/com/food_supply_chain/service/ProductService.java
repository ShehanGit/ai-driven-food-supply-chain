package com.food_supply_chain.service;

import com.food_supply_chain.exception.DuplicateResourceException;
import com.food_supply_chain.exception.ResourceNotFoundException;
import com.food_supply_chain.mapper.ProductMapper;
import com.food_supply_chain.model.Product;
import com.food_supply_chain.model.ProductEnvironmentalCondition;
import com.food_supply_chain.model.User;
import com.food_supply_chain.model.dto.ProductDTO;
import com.food_supply_chain.model.dto.ProductEnvironmentalConditionDTO;
import com.food_supply_chain.repository.ProductEnvironmentalConditionRepository;
import com.food_supply_chain.repository.ProductRepository;
import com.food_supply_chain.repository.UserRepository;
import com.food_supply_chain.util.QRCodeGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductService {
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final ProductEnvironmentalConditionRepository conditionRepository;
    private final ProductMapper productMapper;
    private final QRCodeGenerator qrCodeGenerator;

    @Autowired
    public ProductService(
            ProductRepository productRepository,
            UserRepository userRepository,
            ProductEnvironmentalConditionRepository conditionRepository,
            ProductMapper productMapper,
            QRCodeGenerator qrCodeGenerator) {
        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.conditionRepository = conditionRepository;
        this.productMapper = productMapper;
        this.qrCodeGenerator = qrCodeGenerator;
    }

    @Transactional
    public ProductDTO createProduct(ProductDTO productDTO) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Check if user has FARMER role
        if (user.getRole() != User.Role.FARMER && user.getRole() != User.Role.ADMIN) {
            throw new AccessDeniedException("Only farmers can create products");
        }

        // Generate batch code if not provided
        String batchCode = productDTO.getBatchCode();
        if (batchCode == null || batchCode.isEmpty()) {
            batchCode = generateBatchCode(productDTO.getName());
            productDTO.setBatchCode(batchCode);
        } else {
            // Check if batch code already exists
            if (productRepository.findByBatchCode(batchCode).isPresent()) {
                throw new DuplicateResourceException("Product with batch code " + batchCode + " already exists");
            }
        }

        Product product = productMapper.toEntity(productDTO);
        product.setCreatedBy(user);

        // Generate QR code URL
        String qrCodeUrl = qrCodeGenerator.generateProductQRCode(null, batchCode);
        product.setQrCodeUrl(qrCodeUrl);

        Product savedProduct = productRepository.save(product);

        // Save environmental conditions if provided
        if (productDTO.getEnvironmentalConditions() != null && !productDTO.getEnvironmentalConditions().isEmpty()) {
            for (ProductEnvironmentalConditionDTO conditionDTO : productDTO.getEnvironmentalConditions()) {
                ProductEnvironmentalCondition condition = productMapper.toEnvironmentalConditionEntity(conditionDTO, savedProduct);
                condition.setRecordedBy(username);
                conditionRepository.save(condition);
            }
            // Refresh product with saved conditions
            savedProduct = productRepository.findById(savedProduct.getId()).orElse(savedProduct);
        }

        return productMapper.toDTO(savedProduct);
    }

    @Transactional(readOnly = true)
    public ProductDTO getProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        return productMapper.toDTO(product);
    }

    @Transactional(readOnly = true)
    public ProductDTO getProductByBatchCode(String batchCode) {
        Product product = productRepository.findByBatchCode(batchCode)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with batch code: " + batchCode));
        return productMapper.toDTO(product);
    }

    @Transactional(readOnly = true)
    public List<ProductDTO> getProductsByCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return productRepository.findByCreatedBy(user)
                .stream()
                .map(productMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Page<ProductDTO> getProductsByCurrentUser(Pageable pageable, String search) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Page<Product> products;
        if (search != null && !search.trim().isEmpty()) {
            products = productRepository.findByCreatedByAndSearch(user, search.trim(), pageable);
        } else {
            products = productRepository.findByCreatedBy(user, pageable);
        }

        return products.map(productMapper::toDTO);
    }

    @Transactional
    public ProductDTO updateProduct(Long id, ProductDTO productDTO) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Only the creator or an admin can update the product
        if (!product.getCreatedBy().getUsername().equals(username) && currentUser.getRole() != User.Role.ADMIN) {
            throw new AccessDeniedException("You can only update your own products");
        }

        // Update product fields
        productMapper.updateEntity(product, productDTO);

        Product updatedProduct = productRepository.save(product);

        // Update environmental conditions if provided
        if (productDTO.getEnvironmentalConditions() != null && !productDTO.getEnvironmentalConditions().isEmpty()) {
            for (ProductEnvironmentalConditionDTO conditionDTO : productDTO.getEnvironmentalConditions()) {
                if (conditionDTO.getId() == null) {
                    // This is a new condition
                    ProductEnvironmentalCondition condition = productMapper.toEnvironmentalConditionEntity(conditionDTO, updatedProduct);
                    condition.setRecordedBy(username);
                    conditionRepository.save(condition);
                }
                // If it has an ID, we'll assume it's handled separately through environmental condition endpoints
            }
            // Refresh product with updated conditions
            updatedProduct = productRepository.findById(updatedProduct.getId()).orElse(updatedProduct);
        }

        return productMapper.toDTO(updatedProduct);
    }

    @Transactional
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Only the creator or an admin can delete the product
        if (!product.getCreatedBy().getUsername().equals(username) && currentUser.getRole() != User.Role.ADMIN) {
            throw new AccessDeniedException("You can only delete your own products");
        }

        productRepository.delete(product);
    }

    @Transactional
    public ProductDTO addEnvironmentalCondition(Long productId, ProductEnvironmentalConditionDTO conditionDTO) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        String username = SecurityContextHolder.getContext().getAuthentication().getName();

        ProductEnvironmentalCondition condition = productMapper.toEnvironmentalConditionEntity(conditionDTO, product);
        condition.setRecordedBy(username);

        conditionRepository.save(condition);

        // Refresh product to get updated conditions
        product = productRepository.findById(productId).orElse(product);

        return productMapper.toDTO(product);
    }

    @Transactional(readOnly = true)
    public List<ProductEnvironmentalConditionDTO> getProductEnvironmentalConditions(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        return conditionRepository.findByProductOrderByTimestampDesc(product)
                .stream()
                .map(productMapper::toEnvironmentalConditionDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ProductDTO> searchProducts(String keyword) {
        return productRepository.searchProducts(keyword)
                .stream()
                .map(productMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ProductDTO> getProductsByType(String productType) {
        return productRepository.findByProductType(productType)
                .stream()
                .map(productMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ProductDTO> getOrganicProducts() {
        return productRepository.findOrganicProducts()
                .stream()
                .map(productMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ProductDTO> getExpiringProducts(int days) {
        LocalDate startDate = LocalDate.now();
        LocalDate endDate = startDate.plusDays(days);

        return productRepository.findByExpirationDateBetween(startDate, endDate)
                .stream()
                .map(productMapper::toDTO)
                .collect(Collectors.toList());
    }

    private String generateBatchCode(String productName) {
        String prefix = "";
        if (productName != null && !productName.isEmpty()) {
            // Take the first 3 characters of the product name
            prefix = productName.substring(0, Math.min(productName.length(), 3)).toUpperCase();
        } else {
            prefix = "PRD";
        }

        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        return prefix + "-" + timestamp;
    }
}