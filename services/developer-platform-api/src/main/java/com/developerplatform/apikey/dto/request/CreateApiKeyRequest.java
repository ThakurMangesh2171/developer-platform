package com.developerplatform.apikey.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
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
public class CreateApiKeyRequest {

    @NotNull(message = "Project ID is required")
    private UUID projectId;

    @NotBlank(message = "API key name is required")
    @Size(max = 100, message = "API key name must not exceed 100 characters")
    private String name;

    private LocalDateTime expiresAt;
}
