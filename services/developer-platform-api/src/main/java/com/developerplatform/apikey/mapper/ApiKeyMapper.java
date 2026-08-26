package com.developerplatform.apikey.mapper;

import com.developerplatform.apikey.dto.response.ApiKeyResponse;
import com.developerplatform.apikey.dto.response.CreateApiKeyResponse;
import com.developerplatform.apikey.entity.ApiKey;

public final class ApiKeyMapper {

    private ApiKeyMapper() {
        // Private constructor to prevent instantiation
    }

    public static ApiKeyResponse toResponse(ApiKey apiKey) {
        if (apiKey == null) {
            return null;
        }

        return ApiKeyResponse.builder()
                .id(apiKey.getId())
                .projectId(apiKey.getProjectId())
                .name(apiKey.getName())
                .keyPrefix(apiKey.getKeyPrefix())
                .status(apiKey.getStatus())
                .expiresAt(apiKey.getExpiresAt())
                .lastUsedAt(apiKey.getLastUsedAt())
                .createdAt(apiKey.getCreatedAt())
                .updatedAt(apiKey.getUpdatedAt())
                .build();
    }

    public static CreateApiKeyResponse toCreateResponse(ApiKey apiKey, String rawKey) {
        if (apiKey == null) {
            return null;
        }

        return CreateApiKeyResponse.builder()
                .id(apiKey.getId())
                .projectId(apiKey.getProjectId())
                .name(apiKey.getName())
                .rawKey(rawKey)
                .status(apiKey.getStatus())
                .expiresAt(apiKey.getExpiresAt())
                .createdAt(apiKey.getCreatedAt())
                .build();
    }
}
