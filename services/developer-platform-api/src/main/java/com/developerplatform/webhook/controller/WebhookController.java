package com.developerplatform.webhook.controller;

import com.developerplatform.webhook.dto.CreateWebhookRequest;
import com.developerplatform.webhook.entity.WebhookEndpoint;
import com.developerplatform.webhook.repository.WebhookEndpointRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/projects/{projectId}/webhooks")
@RequiredArgsConstructor
public class WebhookController {

    private final WebhookEndpointRepository webhookEndpointRepository;

    @GetMapping
    public ResponseEntity<List<WebhookEndpoint>> getWebhooks(@PathVariable UUID projectId) {
        return ResponseEntity.ok(webhookEndpointRepository.findByProjectId(projectId));
    }

    @PostMapping
    public ResponseEntity<WebhookEndpoint> createWebhook(@PathVariable UUID projectId, @RequestBody CreateWebhookRequest request) {
        WebhookEndpoint endpoint = WebhookEndpoint.builder()
                .projectId(projectId)
                .url(request.getUrl())
                .signingSecret(generateSecret())
                .isActive(true)
                .build();
                
        WebhookEndpoint saved = webhookEndpointRepository.save(endpoint);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{webhookId}")
    public ResponseEntity<Void> deleteWebhook(@PathVariable UUID projectId, @PathVariable UUID webhookId) {
        webhookEndpointRepository.deleteById(webhookId);
        return ResponseEntity.noContent().build();
    }
    
    private String generateSecret() {
        return "whsec_" + UUID.randomUUID().toString().replace("-", "");
    }
}
