package com.developerplatform.apikey.controller;

import com.developerplatform.apikey.dto.request.CreateApiKeyRequest;
import com.developerplatform.apikey.dto.response.ApiKeyResponse;
import com.developerplatform.apikey.dto.response.CreateApiKeyResponse;
import com.developerplatform.apikey.service.interfaces.ApiKeyService;
import com.developerplatform.common.constants.ApiPaths;
import com.developerplatform.common.constants.messages.ApiKeyMessages;
import com.developerplatform.common.response.ApiResponse;
import com.developerplatform.security.UserPrincipal;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping(ApiPaths.API_KEYS)
@RequiredArgsConstructor
public class ApiKeyController {

    private final ApiKeyService apiKeyService;

    @PostMapping
    public ResponseEntity<ApiResponse<CreateApiKeyResponse>> createApiKey(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody CreateApiKeyRequest request) {

        CreateApiKeyResponse responseData = apiKeyService.createApiKey(principal.getId(), request);

        ApiResponse<CreateApiKeyResponse> response = ApiResponse.<CreateApiKeyResponse>builder()
                .success(true)
                .message(ApiKeyMessages.API_KEY_CREATED)
                .data(responseData)
                .timestamp(LocalDateTime.now())
                .build();

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ApiKeyResponse>>> getProjectApiKeys(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam UUID projectId) {

        List<ApiKeyResponse> responseData = apiKeyService.getProjectApiKeys(principal.getId(), projectId);

        ApiResponse<List<ApiKeyResponse>> response = ApiResponse.<List<ApiKeyResponse>>builder()
                .success(true)
                .message("API keys retrieved successfully")
                .data(responseData)
                .timestamp(LocalDateTime.now())
                .build();

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> revokeApiKey(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID id) {

        apiKeyService.revokeApiKey(principal.getId(), id);

        ApiResponse<Void> response = ApiResponse.<Void>builder()
                .success(true)
                .message(ApiKeyMessages.API_KEY_REVOKED)
                .timestamp(LocalDateTime.now())
                .build();

        return ResponseEntity.ok(response);
    }
}
