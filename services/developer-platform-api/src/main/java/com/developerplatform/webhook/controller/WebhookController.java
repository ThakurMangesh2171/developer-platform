package com.developerplatform.webhook.controller;

import com.developerplatform.common.response.ApiResponse;
import com.developerplatform.webhook.dto.CreateWebhookRequest;
import com.developerplatform.webhook.entity.WebhookEndpoint;
import com.developerplatform.webhook.service.WebhookService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/projects/{projectId}/webhooks")
@RequiredArgsConstructor
public class WebhookController {

    private final java.time.Clock clock;
    private final WebhookService webhookService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<WebhookEndpoint>>> getWebhooks(@PathVariable UUID projectId) {
        List<WebhookEndpoint> data = webhookService.getWebhooks(projectId);
        
        ApiResponse<List<WebhookEndpoint>> response = ApiResponse.<List<WebhookEndpoint>>builder()
                .success(true)
                .message("Webhooks retrieved successfully")
                .data(data)
                .timestamp(java.time.LocalDateTime.now(clock))
                .build();
                
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<ApiResponse<WebhookEndpoint>> createWebhook(@PathVariable UUID projectId, @RequestBody CreateWebhookRequest request) {
        WebhookEndpoint data = webhookService.createWebhook(projectId, request);
        
        ApiResponse<WebhookEndpoint> response = ApiResponse.<WebhookEndpoint>builder()
                .success(true)
                .message("Webhook created successfully")
                .data(data)
                .timestamp(java.time.LocalDateTime.now(clock))
                .build();
                
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{webhookId}")
    public ResponseEntity<ApiResponse<Void>> deleteWebhook(@PathVariable UUID projectId, @PathVariable UUID webhookId) {
        webhookService.deleteWebhook(webhookId);
        
        ApiResponse<Void> response = ApiResponse.<Void>builder()
                .success(true)
                .message("Webhook deleted successfully")
                .timestamp(java.time.LocalDateTime.now(clock))
                .build();
                
        return ResponseEntity.ok(response);
    }
}
