package com.food_supply_chain.repository;

import com.food_supply_chain.model.Product;
import com.food_supply_chain.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByCreatedBy(User createdBy);
}