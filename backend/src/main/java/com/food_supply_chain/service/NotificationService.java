package com.food_supply_chain.service;

import com.food_supply_chain.exception.ResourceNotFoundException;
import com.food_supply_chain.model.Notification;
import com.food_supply_chain.model.SupplyChainEvent;
import com.food_supply_chain.model.User;
import com.food_supply_chain.repository.NotificationRepository;
import com.food_supply_chain.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class NotificationService {
    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    @Autowired
    public NotificationService(NotificationRepository notificationRepository, UserRepository userRepository) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public void createEventNotification(SupplyChainEvent event, String message) {
        // Notify the initiator
        createNotification(
                event.getInitiatedBy(),
                "Event Created: " + event.getEventType(),
                message,
                Notification.NotificationType.EVENT_CREATED,
                "SupplyChainEvent",
                event.getId()
        );

        // Notify the receiver if applicable
        if (event.getReceivedBy() != null) {
            createNotification(
                    event.getReceivedBy(),
                    "New Event: " + event.getEventType(),
                    "You have been assigned as the receiver for a " + event.getEventType() + " event.",
                    Notification.NotificationType.EVENT_CREATED,
                    "SupplyChainEvent",
                    event.getId()
            );
        }
    }

    @Transactional
    public void createBatchStatusNotification(Long batchId, String batchCode, String oldStatus, String newStatus, List<User> usersToNotify) {
        String title = "Batch Status Changed: " + batchCode;
        String message = "Batch status changed from " + oldStatus + " to " + newStatus;

        for (User user : usersToNotify) {
            createNotification(
                    user,
                    title,
                    message,
                    Notification.NotificationType.STATUS_CHANGED,
                    "Batch",
                    batchId
            );
        }
    }

    @Transactional
    public void createQualityIssueNotification(Long batchId, String batchCode, String issue, List<User> usersToNotify) {
        String title = "Quality Issue Detected: " + batchCode;
        String message = "Quality issue detected: " + issue;

        for (User user : usersToNotify) {
            createNotification(
                    user,
                    title,
                    message,
                    Notification.NotificationType.QUALITY_ISSUE,
                    "Batch",
                    batchId
            );
        }
    }

    @Transactional
    public void createExpirationWarningNotification(Long batchId, String batchCode, int daysRemaining, List<User> usersToNotify) {
        String title = "Expiration Warning: " + batchCode;
        String message = "Batch will expire in " + daysRemaining + " days.";

        for (User user : usersToNotify) {
            createNotification(
                    user,
                    title,
                    message,
                    Notification.NotificationType.EXPIRATION_WARNING,
                    "Batch",
                    batchId
            );
        }
    }

    @Transactional
    public void createSystemNotification(String title, String message, List<User> usersToNotify) {
        for (User user : usersToNotify) {
            createNotification(
                    user,
                    title,
                    message,
                    Notification.NotificationType.SYSTEM_NOTIFICATION,
                    null,
                    null
            );
        }
    }

    private void createNotification(User user, String title, String message,
                                    Notification.NotificationType type,
                                    String entityType, Long entityId) {
        Notification notification = new Notification();
        notification.setUser(user);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setNotificationType(type);
        notification.setRelatedEntityType(entityType);
        notification.setRelatedEntityId(entityId);

        notificationRepository.save(notification);
    }

    @Transactional(readOnly = true)
    public Page<Notification> getUserNotifications(Pageable pageable) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return notificationRepository.findByUserOrderByCreatedAtDesc(user, pageable);
    }

    @Transactional(readOnly = true)
    public List<Notification> getUnreadNotifications() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return notificationRepository.findByUserAndReadOrderByCreatedAtDesc(user, false);
    }

    @Transactional(readOnly = true)
    public long countUnreadNotifications() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return notificationRepository.countUnreadNotifications(user);
    }

    @Transactional
    public void markNotificationAsRead(Long notificationId) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));

        if (!notification.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("Cannot mark someone else's notification as read");
        }

        notification.setRead(true);
        notificationRepository.save(notification);
    }

    @Transactional
    public void markAllNotificationsAsRead() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        notificationRepository.markAllAsRead(user);
    }
}