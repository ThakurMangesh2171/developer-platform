package com.developerplatform.notification.controller;

import com.developerplatform.security.UserPrincipal;
import com.developerplatform.common.response.ApiResponse;
import com.developerplatform.notification.dto.NotificationResponse;
import com.developerplatform.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final java.time.Clock clock;
    private final NotificationService notificationService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<NotificationResponse>>> getNotifications(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestParam(defaultValue = "false") boolean unreadOnly) {
        
        List<NotificationResponse> data = unreadOnly ?
                notificationService.getUnreadNotificationsForUser(userPrincipal.getId()) :
                notificationService.getNotificationsForUser(userPrincipal.getId());
                
        ApiResponse<List<NotificationResponse>> response = ApiResponse.<List<NotificationResponse>>builder()
                .success(true)
                .message("Notifications retrieved successfully")
                .data(data)
                .timestamp(java.time.LocalDateTime.now(clock))
                .build();
                
        return ResponseEntity.ok(response);
    }

    @GetMapping("/unread-count")
    public ResponseEntity<ApiResponse<Long>> getUnreadCount(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        Long data = notificationService.getUnreadCount(userPrincipal.getId());
        
        ApiResponse<Long> response = ApiResponse.<Long>builder()
                .success(true)
                .message("Unread notification count retrieved successfully")
                .data(data)
                .timestamp(java.time.LocalDateTime.now(clock))
                .build();
                
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<ApiResponse<Void>> markAsRead(
            @PathVariable UUID id,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        
        notificationService.markAsRead(id, userPrincipal.getId());
        
        ApiResponse<Void> response = ApiResponse.<Void>builder()
                .success(true)
                .message("Notification marked as read successfully")
                .timestamp(java.time.LocalDateTime.now(clock))
                .build();
                
        return ResponseEntity.ok(response);
    }
    
    @PutMapping("/read-all")
    public ResponseEntity<ApiResponse<Void>> markAllAsRead(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        notificationService.markAllAsRead(userPrincipal.getId());
        
        ApiResponse<Void> response = ApiResponse.<Void>builder()
                .success(true)
                .message("All notifications marked as read successfully")
                .timestamp(java.time.LocalDateTime.now(clock))
                .build();
                
        return ResponseEntity.ok(response);
    }
}
