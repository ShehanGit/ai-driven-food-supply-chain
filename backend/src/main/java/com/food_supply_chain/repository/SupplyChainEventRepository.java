package com.food_supply_chain.repository;

import com.food_supply_chain.model.Batch;
import com.food_supply_chain.model.SupplyChainEvent;
import com.food_supply_chain.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface SupplyChainEventRepository extends JpaRepository<SupplyChainEvent, Long> {
    List<SupplyChainEvent> findByBatch(Batch batch);

    List<SupplyChainEvent> findByBatchOrderByTimestampDesc(Batch batch);

    List<SupplyChainEvent> findByEventType(SupplyChainEvent.EventType eventType);

    List<SupplyChainEvent> findByInitiatedBy(User user);

    List<SupplyChainEvent> findByReceivedBy(User user);

    @Query("SELECT e FROM SupplyChainEvent e WHERE e.timestamp BETWEEN :startDate AND :endDate")
    List<SupplyChainEvent> findByDateRange(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);

    @Query("SELECT e FROM SupplyChainEvent e WHERE e.batch = :batch AND e.eventType = :eventType")
    List<SupplyChainEvent> findByBatchAndEventType(
            @Param("batch") Batch batch,
            @Param("eventType") SupplyChainEvent.EventType eventType);

    @Query("SELECT e FROM SupplyChainEvent e WHERE " +
            "e.batch.product.id = :productId ORDER BY e.timestamp DESC")
    List<SupplyChainEvent> findByProductId(@Param("productId") Long productId);

    @Query("SELECT e FROM SupplyChainEvent e WHERE " +
            "e.initiatedBy.id = :userId OR e.receivedBy.id = :userId")
    Page<SupplyChainEvent> findByUserInvolved(@Param("userId") Long userId, Pageable pageable);

    @Query("SELECT e FROM SupplyChainEvent e WHERE " +
            "e.location LIKE %:location% OR e.geoCoordinates LIKE %:coordinates%")
    List<SupplyChainEvent> findByLocation(
            @Param("location") String location,
            @Param("coordinates") String coordinates);
}