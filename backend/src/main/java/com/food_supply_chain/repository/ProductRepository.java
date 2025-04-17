package com.food_supply_chain.repository;

import com.food_supply_chain.model.Product;
import com.food_supply_chain.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByCreatedBy(User createdBy);

    Page<Product> findByCreatedBy(User createdBy, Pageable pageable);

    Optional<Product> findByBatchCode(String batchCode);

    @Query("SELECT p FROM Product p WHERE p.name LIKE %:keyword% OR p.description LIKE %:keyword%")
    List<Product> searchProducts(@Param("keyword") String keyword);

    @Query("SELECT p FROM Product p WHERE p.expirationDate BETWEEN :startDate AND :endDate")
    List<Product> findByExpirationDateBetween(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    @Query("SELECT p FROM Product p WHERE p.productType = :type")
    List<Product> findByProductType(@Param("type") String productType);

    @Query("SELECT p FROM Product p WHERE p.organic = true")
    List<Product> findOrganicProducts();

    @Query("SELECT p FROM Product p WHERE p.createdBy = :farmer AND " +
            "(LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(p.description) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Product> findByCreatedByAndSearch(@Param("farmer") User farmer, @Param("search") String search, Pageable pageable);

    @Query("SELECT p FROM Product p WHERE p.certification = :certification")
    List<Product> findByCertification(@Param("certification") String certification);
}