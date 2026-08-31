package com.developerplatform.apikey.dto.response;

import com.developerplatform.apikey.enums.ApiKeyStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateApiKeyResponse {

    private UUID id;
    private UUID projectId;
    private String name;
    private String rawKey;
    private ApiKeyStatus status;
    private LocalDateTime expiresAt;
    private LocalDateTime createdAt;
}
