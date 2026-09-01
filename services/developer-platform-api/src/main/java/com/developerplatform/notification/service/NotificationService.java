package com.developerplatform.notification.service;

import com.developerplatform.notification.dto.NotificationResponse;
import com.developerplatform.notification.enums.NotificationType;

import java.util.List;
import java.util.UUID;

public interface NotificationService {
    void createNotification(UUID userId, String title, String message, NotificationType type);
    List<NotificationResponse> getNotificationsForUser(UUID userId);
    List<NotificationResponse> getUnreadNotificationsForUser(UUID userId);
    long getUnreadCount(UUID userId);
    void markAsRead(UUID notificationId, UUID userId);
    void markAllAsRead(UUID userId);
}
