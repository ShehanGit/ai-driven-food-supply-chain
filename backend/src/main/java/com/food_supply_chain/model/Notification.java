package com.food_supply_chain.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@Data
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "message", nullable = false, length = 1000)
    private String message;

    @Column(name = "read", nullable = false)
    private boolean read = false;

    @Column(name = "notification_type")
    @Enumerated(EnumType.STRING)
    private NotificationType notificationType;

    @Column(name = "related_entity_id")
    private Long relatedEntityId;

    @Column(name = "related_entity_type")
    private String relatedEntityType;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    public enum NotificationType {
        EVENT_CREATED,
        STATUS_CHANGED,
        QUALITY_ISSUE,
        BATCH_RECEIVED,
        BATCH_SHIPPED,
        EXPIRATION_WARNING,
        SYSTEM_NOTIFICATION
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}