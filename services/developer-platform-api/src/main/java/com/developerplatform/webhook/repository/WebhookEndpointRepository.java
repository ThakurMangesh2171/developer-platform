package com.developerplatform.webhook.repository;

import com.developerplatform.webhook.entity.WebhookEndpoint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface WebhookEndpointRepository extends JpaRepository<WebhookEndpoint, UUID> {
    
    List<WebhookEndpoint> findByProjectId(UUID projectId);
    
    List<WebhookEndpoint> findByProjectIdAndIsActiveTrue(UUID projectId);
}
