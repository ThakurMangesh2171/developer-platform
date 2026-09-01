package com.developerplatform.notification.service.impl;

import com.developerplatform.auth.entity.User;
import com.developerplatform.auth.repository.UserRepository;
import com.developerplatform.common.enums.ErrorCode;
import com.developerplatform.common.constants.messages.NotificationMessages;
import com.developerplatform.common.constants.messages.UserMessages;
import com.developerplatform.common.exception.ResourceNotFoundException;
import com.developerplatform.notification.dto.NotificationResponse;
import com.developerplatform.notification.entity.Notification;
import com.developerplatform.notification.enums.NotificationType;
import com.developerplatform.notification.repository.NotificationRepository;
import com.developerplatform.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public void createNotification(UUID userId, String title, String message, NotificationType type) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.RESOURCE_NOT_FOUND, UserMessages.USER_NOT_FOUND));

        Notification notification = Notification.builder()
                .user(user)
                .title(title)
                .message(message)
                .type(type)
                .isRead(false)
                .build();

        notificationRepository.save(notification);
    }

    @Override
    @Transactional(readOnly = true)
    public List<NotificationResponse> getNotificationsForUser(UUID userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<NotificationResponse> getUnreadNotificationsForUser(UUID userId) {
        return notificationRepository.findByUserIdAndIsReadFalseOrderByCreatedAtDesc(userId).stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public long getUnreadCount(UUID userId) {
        return notificationRepository.countByUserIdAndIsReadFalse(userId);
    }

    @Override
    @Transactional
    public void markAsRead(UUID notificationId, UUID userId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.RESOURCE_NOT_FOUND, NotificationMessages.NOTIFICATION_NOT_FOUND));

        if (!notification.getUser().getId().equals(userId)) {
            throw new ResourceNotFoundException(ErrorCode.RESOURCE_NOT_FOUND, NotificationMessages.NOTIFICATION_NOT_FOUND);
        }

        notification.setRead(true);
        notificationRepository.save(notification);
    }

    @Override
    @Transactional
    public void markAllAsRead(UUID userId) {
        List<Notification> unreadNotifications = notificationRepository.findByUserIdAndIsReadFalseOrderByCreatedAtDesc(userId);
        unreadNotifications.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(unreadNotifications);
    }

    private NotificationResponse mapToResponse(Notification notification) {
        return NotificationResponse.builder()
                .id(notification.getId())
                .title(notification.getTitle())
                .message(notification.getMessage())
                .type(notification.getType())
                .isRead(notification.isRead())
                .createdAt(notification.getCreatedAt())
                .build();
    }
}
