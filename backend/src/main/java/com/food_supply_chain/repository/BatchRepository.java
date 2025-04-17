package com.food_supply_chain.repository;

import com.food_supply_chain.model.Batch;
import com.food_supply_chain.model.Product;
import com.food_supply_chain.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface BatchRepository extends JpaRepository<Batch, Long> {
    List<Batch> findByCreatedBy(User createdBy);

    List<Batch> findByProduct(Product product);

    Optional<Batch> findByBatchCode(String batchCode);

    @Query("SELECT b FROM Batch b WHERE b.expirationDate <= :date")
    List<Batch> findExpiringBatches(@Param("date") LocalDate date);

    @Query("SELECT b FROM Batch b WHERE b.status = :status")
    List<Batch> findByStatus(@Param("status") Batch.BatchStatus status);

    @Query("SELECT b FROM Batch b WHERE b.createdBy = :user AND b.status = :status")
    List<Batch> findByCreatedByAndStatus(@Param("user") User user, @Param("status") Batch.BatchStatus status);
}