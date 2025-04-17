package com.food_supply_chain.repository;

import com.food_supply_chain.model.Product;
import com.food_supply_chain.model.ProductEnvironmentalCondition;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface ProductEnvironmentalConditionRepository extends JpaRepository<ProductEnvironmentalCondition, Long> {
    List<ProductEnvironmentalCondition> findByProduct(Product product);

    List<ProductEnvironmentalCondition> findByProductOrderByTimestampDesc(Product product);

    @Query("SELECT e FROM ProductEnvironmentalCondition e WHERE e.timestamp BETWEEN :startDate AND :endDate")
    List<ProductEnvironmentalCondition> findByDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    @Query("SELECT e FROM ProductEnvironmentalCondition e WHERE e.product = :product AND e.timestamp BETWEEN :startDate AND :endDate")
    List<ProductEnvironmentalCondition> findByProductAndDateRange(
            @Param("product") Product product,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);

    @Query("SELECT e FROM ProductEnvironmentalCondition e WHERE e.product = :product AND (e.temperature > :maxTemp OR e.temperature < :minTemp)")
    List<ProductEnvironmentalCondition> findTemperatureAnomalies(
            @Param("product") Product product,
            @Param("minTemp") Double minTemp,
            @Param("maxTemp") Double maxTemp);

    @Query("SELECT e FROM ProductEnvironmentalCondition e WHERE e.product = :product AND (e.humidity > :maxHumidity OR e.humidity < :minHumidity)")
    List<ProductEnvironmentalCondition> findHumidityAnomalies(
            @Param("product") Product product,
            @Param("minHumidity") Double minHumidity,
            @Param("maxHumidity") Double maxHumidity);
}