package com.developerplatform.webhook.service;

import com.developerplatform.webhook.entity.WebhookEndpoint;
import com.developerplatform.webhook.repository.WebhookEndpointRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;

@Slf4j
@Service
@RequiredArgsConstructor
public class WebhookService {

    private final WebhookEndpointRepository webhookEndpointRepository;
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper;

    public List<WebhookEndpoint> getWebhooks(UUID projectId) {
        return webhookEndpointRepository.findByProjectId(projectId);
    }

    public WebhookEndpoint createWebhook(UUID projectId, com.developerplatform.webhook.dto.CreateWebhookRequest request) {
        WebhookEndpoint endpoint = WebhookEndpoint.builder()
                .projectId(projectId)
                .url(request.getUrl())
                .signingSecret(generateSecret())
                .isActive(true)
                .build();
                
        return webhookEndpointRepository.save(endpoint);
    }

    public void deleteWebhook(UUID webhookId) {
        webhookEndpointRepository.deleteById(webhookId);
    }

    private String generateSecret() {
        return "whsec_" + UUID.randomUUID().toString().replace("-", "");
    }

    /**
     * Dispatches an event to all active webhooks for a project asynchronously.
     */
    public void dispatchEvent(UUID projectId, String eventType, Object payload) {
        List<WebhookEndpoint> endpoints = webhookEndpointRepository.findByProjectIdAndIsActiveTrue(projectId);
        
        if (endpoints.isEmpty()) {
            return;
        }

        Map<String, Object> eventData = new HashMap<>();
        eventData.put("type", eventType);
        eventData.put("data", payload);
        eventData.put("timestamp", System.currentTimeMillis());

        try {
            String jsonPayload = objectMapper.writeValueAsString(eventData);

            for (WebhookEndpoint endpoint : endpoints) {
                // Fire and forget using CompletableFuture to not block the main thread
                CompletableFuture.runAsync(() -> sendWebhook(endpoint, jsonPayload));
            }
        } catch (Exception e) {
            log.error("Failed to serialize webhook payload for event: {}", eventType, e);
        }
    }

    private void sendWebhook(WebhookEndpoint endpoint, String jsonPayload) {
        try {
            String signature = generateSignature(jsonPayload, endpoint.getSigningSecret());

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("X-Webhook-Signature", signature);
            headers.set("User-Agent", "DeveloperPlatform-Webhook/1.0");

            HttpEntity<String> request = new HttpEntity<>(jsonPayload, headers);

            log.info("Dispatching webhook to {}", endpoint.getUrl());
            restTemplate.postForEntity(endpoint.getUrl(), request, String.class);
            log.info("Successfully dispatched webhook to {}", endpoint.getUrl());

        } catch (Exception e) {
            log.error("Failed to dispatch webhook to URL: {}. Reason: {}", endpoint.getUrl(), e.getMessage());
        }
    }

    private String generateSignature(String payload, String secret) throws NoSuchAlgorithmException, InvalidKeyException {
        Mac sha256Hmac = Mac.getInstance("HmacSHA256");
        SecretKeySpec secretKey = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
        sha256Hmac.init(secretKey);
        byte[] hash = sha256Hmac.doFinal(payload.getBytes(StandardCharsets.UTF_8));
        return Base64.getEncoder().encodeToString(hash);
    }
}
