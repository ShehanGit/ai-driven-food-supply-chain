package com.food_supply_chain.service;

import com.food_supply_chain.exception.DuplicateResourceException;
import com.food_supply_chain.exception.ResourceNotFoundException;
import com.food_supply_chain.mapper.BatchMapper;
import com.food_supply_chain.model.Batch;
import com.food_supply_chain.model.BatchEvent;
import com.food_supply_chain.model.Product;
import com.food_supply_chain.model.User;
import com.food_supply_chain.model.dto.BatchDTO;
import com.food_supply_chain.model.dto.BatchEventDTO;
import com.food_supply_chain.repository.BatchEventRepository;
import com.food_supply_chain.repository.BatchRepository;
import com.food_supply_chain.repository.ProductRepository;
import com.food_supply_chain.repository.UserRepository;
import com.food_supply_chain.util.QRCodeGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BatchService {
    private final BatchRepository batchRepository;
    private final BatchEventRepository batchEventRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final BatchMapper batchMapper;
    private final QRCodeGenerator qrCodeGenerator;

    @Autowired
    public BatchService(
            BatchRepository batchRepository,
            BatchEventRepository batchEventRepository,
            ProductRepository productRepository,
            UserRepository userRepository,
            BatchMapper batchMapper,
            QRCodeGenerator qrCodeGenerator) {
        this.batchRepository = batchRepository;
        this.batchEventRepository = batchEventRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.batchMapper = batchMapper;
        this.qrCodeGenerator = qrCodeGenerator;
    }

    @Transactional
    public BatchDTO createBatch(BatchDTO batchDTO) {
        // Get the current user
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Check if user is a farmer
        if (user.getRole() != User.Role.FARMER && user.getRole() != User.Role.ADMIN) {
            throw new AccessDeniedException("Only farmers can create batches");
        }

        // Get the product
        Product product = productRepository.findById(batchDTO.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        // Check if the user is the creator of the product
        if (!product.getCreatedBy().getUsername().equals(username) && user.getRole() != User.Role.ADMIN) {
            throw new AccessDeniedException("You can only create batches for your own products");
        }

        // Generate batch code if not provided
        String batchCode = batchDTO.getBatchCode();
        if (batchCode == null || batchCode.isEmpty()) {
            batchCode = qrCodeGenerator.generateBatchCode(product.getName().substring(0, Math.min(product.getName().length(), 3)).toUpperCase());
        } else {
            // Check if batch code already exists
            if (batchRepository.findByBatchCode(batchCode).isPresent()) {
                throw new DuplicateResourceException("Batch with code " + batchCode + " already exists");
            }
        }

        // Create the batch
        Batch batch = new Batch();
        batch.setBatchCode(batchCode);
        batch.setProduct(product);
        batch.setQuantity(batchDTO.getQuantity());
        batch.setProductionDate(batchDTO.getProductionDate() != null ? batchDTO.getProductionDate() : LocalDate.now());
        batch.setExpirationDate(batchDTO.getExpirationDate());
        batch.setStatus(Batch.BatchStatus.CREATED);
        batch.setCreatedBy(user);
        batch.setNotes(batchDTO.getNotes());

        // Generate QR code
        String qrCodeUrl = qrCodeGenerator.generateBatchQRCode(null, batchCode);
        batch.setQrCodeUrl(qrCodeUrl);

        // Save the batch
        Batch savedBatch = batchRepository.save(batch);

        // Create the initial CREATED event
        BatchEvent event = new BatchEvent();
        event.setBatch(savedBatch);
        event.setRecordedBy(user);
        event.setEventType(BatchEvent.EventType.CREATED);
        event.setLocation(user.getLocationCoordinates());
        event.setNotes("Batch created by " + username);

        batchEventRepository.save(event);

        // Refresh batch to get the event
        savedBatch = batchRepository.findById(savedBatch.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Batch not found after creation"));

        return batchMapper.toDTO(savedBatch);
    }

    @Transactional(readOnly = true)
    public BatchDTO getBatch(Long id) {
        Batch batch = batchRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Batch not found"));
        return batchMapper.toDTO(batch);
    }

    @Transactional(readOnly = true)
    public BatchDTO getBatchByCode(String batchCode) {
        Batch batch = batchRepository.findByBatchCode(batchCode)
                .orElseThrow(() -> new ResourceNotFoundException("Batch not found with code: " + batchCode));
        return batchMapper.toDTO(batch);
    }

    @Transactional(readOnly = true)
    public List<BatchDTO> getBatchesByProduct(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        return batchRepository.findByProduct(product)
                .stream()
                .map(batchMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<BatchDTO> getBatchesByCurrentUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return batchRepository.findByCreatedBy(user)
                .stream()
                .map(batchMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<BatchDTO> getBatchesByStatus(String status) {
        try {
            Batch.BatchStatus batchStatus = Batch.BatchStatus.valueOf(status.toUpperCase());

            return batchRepository.findByStatus(batchStatus)
                    .stream()
                    .map(batchMapper::toDTO)
                    .collect(Collectors.toList());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid batch status: " + status);
        }
    }

    @Transactional
    public BatchDTO updateBatchStatus(Long id, String newStatus, BatchEventDTO eventDTO) {
        Batch batch = batchRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Batch not found"));

        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Validate status transition
        try {
            Batch.BatchStatus status = Batch.BatchStatus.valueOf(newStatus.toUpperCase());
            batch.setStatus(status);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid batch status: " + newStatus);
        }

        // Save the batch with new status
        Batch updatedBatch = batchRepository.save(batch);

        // Create a batch event for the status change
        BatchEvent event = new BatchEvent();
        event.setBatch(updatedBatch);
        event.setRecordedBy(user);
        event.setEventType(BatchEvent.EventType.valueOf(eventDTO.getEventType()));
        event.setLocation(eventDTO.getLocation());
        event.setTemperature(eventDTO.getTemperature());
        event.setHumidity(eventDTO.getHumidity());
        event.setNotes(eventDTO.getNotes());

        batchEventRepository.save(event);

        // Refresh batch to include the new event
        updatedBatch = batchRepository.findById(updatedBatch.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Batch not found after update"));

        return batchMapper.toDTO(updatedBatch);
    }

    @Transactional
    public BatchDTO addBatchEvent(Long batchId, BatchEventDTO eventDTO) {
        Batch batch = batchRepository.findById(batchId)
                .orElseThrow(() -> new ResourceNotFoundException("Batch not found"));

        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Create the batch event
        BatchEvent event = batchMapper.toEventEntity(eventDTO, batch);
        event.setRecordedBy(user);

        batchEventRepository.save(event);

        // Refresh batch to include the new event
        batch = batchRepository.findById(batchId)
                .orElseThrow(() -> new ResourceNotFoundException("Batch not found after adding event"));

        return batchMapper.toDTO(batch);
    }

    @Transactional(readOnly = true)
    public List<BatchEventDTO> getBatchEvents(Long batchId) {
        Batch batch = batchRepository.findById(batchId)
                .orElseThrow(() -> new ResourceNotFoundException("Batch not found"));

        return batchEventRepository.findByBatchOrderByTimestampDesc(batch)
                .stream()
                .map(batchMapper::toEventDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<BatchDTO> getExpiringBatches(int days) {
        LocalDate expirationDate = LocalDate.now().plusDays(days);

        return batchRepository.findExpiringBatches(expirationDate)
                .stream()
                .map(batchMapper::toDTO)
                .collect(Collectors.toList());
    }
}