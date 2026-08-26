package com.developerplatform.apikey.service.interfaces;

import com.developerplatform.apikey.dto.request.CreateApiKeyRequest;
import com.developerplatform.apikey.dto.response.ApiKeyResponse;
import com.developerplatform.apikey.dto.response.CreateApiKeyResponse;

import java.util.List;
import java.util.UUID;

public interface ApiKeyService {

    CreateApiKeyResponse createApiKey(UUID userId, CreateApiKeyRequest request);

    List<ApiKeyResponse> getProjectApiKeys(UUID userId, UUID projectId);

    void revokeApiKey(UUID userId, UUID apiKeyId);
}
