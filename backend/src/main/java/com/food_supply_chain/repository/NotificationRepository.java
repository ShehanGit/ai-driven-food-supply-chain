package com.food_supply_chain.repository;

import com.food_supply_chain.model.Notification;
import com.food_supply_chain.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUserOrderByCreatedAtDesc(User user);

    Page<Notification> findByUserOrderByCreatedAtDesc(User user, Pageable pageable);

    List<Notification> findByUserAndReadOrderByCreatedAtDesc(User user, boolean read);

    @Query("SELECT COUNT(n) FROM Notification n WHERE n.user = :user AND n.read = false")
    long countUnreadNotifications(@Param("user") User user);

    @Modifying
    @Query("UPDATE Notification n SET n.read = true WHERE n.user = :user")
    void markAllAsRead(@Param("user") User user);

    @Query("SELECT n FROM Notification n WHERE n.relatedEntityType = :entityType AND n.relatedEntityId = :entityId")
    List<Notification> findByRelatedEntity(@Param("entityType") String entityType, @Param("entityId") Long entityId);
}