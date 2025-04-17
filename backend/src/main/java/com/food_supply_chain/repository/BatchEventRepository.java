package com.food_supply_chain.repository;

import com.food_supply_chain.model.Batch;
import com.food_supply_chain.model.BatchEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface BatchEventRepository extends JpaRepository<BatchEvent, Long> {
    List<BatchEvent> findByBatch(Batch batch);

    List<BatchEvent> findByBatchOrderByTimestampDesc(Batch batch);

    List<BatchEvent> findByEventType(BatchEvent.EventType eventType);

    @Query("SELECT e FROM BatchEvent e WHERE e.timestamp BETWEEN :startDate AND :endDate")
    List<BatchEvent> findByDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    @Query("SELECT e FROM BatchEvent e WHERE e.batch = :batch AND e.eventType = :eventType")
    List<BatchEvent> findByBatchAndEventType(@Param("batch") Batch batch, @Param("eventType") BatchEvent.EventType eventType);
}