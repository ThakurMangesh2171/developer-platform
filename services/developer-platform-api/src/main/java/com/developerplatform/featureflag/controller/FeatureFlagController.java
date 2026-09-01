package com.developerplatform.featureflag.controller;

import com.developerplatform.common.constants.ApiPaths;
import com.developerplatform.featureflag.dto.request.CreateFeatureFlagRequest;
import com.developerplatform.common.response.ApiResponse;
import com.developerplatform.featureflag.dto.response.FeatureFlagResponse;
import com.developerplatform.featureflag.service.interfaces.FeatureFlagService;
import com.developerplatform.featureflag.utils.FeatureFlagValidationUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping(ApiPaths.FEATURE_FLAGS)
@RequiredArgsConstructor
public class FeatureFlagController {

    private final java.time.Clock clock;
    private final FeatureFlagService featureFlagService;
    private final FeatureFlagValidationUtils featureFlagValidationUtils;

    @PostMapping
    public ResponseEntity<ApiResponse<FeatureFlagResponse>> createFeatureFlag(
            @Valid @RequestBody CreateFeatureFlagRequest request,
            @RequestParam(required = false) UUID projectId,
            Authentication authentication) {
        
        UUID authenticatedProjectId = getProjectIdFromAuthentication(authentication);
        if (projectId != null && !projectId.equals(authenticatedProjectId)) {
            throw new IllegalArgumentException("The provided API Key does not belong to this project.");
        }
        
        featureFlagValidationUtils.validateFeatureFlagKeyForCreation(authenticatedProjectId, request.getKey());
        FeatureFlagResponse data = featureFlagService.createFeatureFlag(authenticatedProjectId, request);
        
        ApiResponse<FeatureFlagResponse> response = ApiResponse.<FeatureFlagResponse>builder()
                .success(true)
                .message("Feature flag created successfully")
                .data(data)
                .timestamp(java.time.LocalDateTime.now(clock))
                .build();
                
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<FeatureFlagResponse>>> getProjectFeatureFlags(
            @RequestParam(required = false) UUID projectId,
            Authentication authentication) {
            
        UUID authenticatedProjectId = getProjectIdFromAuthentication(authentication);
        if (projectId != null && !projectId.equals(authenticatedProjectId)) {
            throw new IllegalArgumentException("The provided API Key does not belong to this project.");
        }
        
        List<FeatureFlagResponse> data = featureFlagService.getProjectFeatureFlags(authenticatedProjectId);
        
        ApiResponse<List<FeatureFlagResponse>> response = ApiResponse.<List<FeatureFlagResponse>>builder()
                .success(true)
                .message("Feature flags retrieved successfully")
                .data(data)
                .timestamp(java.time.LocalDateTime.now(clock))
                .build();
                
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{key}")
    public ResponseEntity<ApiResponse<FeatureFlagResponse>> getFeatureFlag(
            @PathVariable String key,
            Authentication authentication) {
            
        UUID authenticatedProjectId = getProjectIdFromAuthentication(authentication);
        FeatureFlagResponse data = featureFlagService.getFeatureFlag(authenticatedProjectId, key);
        
        ApiResponse<FeatureFlagResponse> response = ApiResponse.<FeatureFlagResponse>builder()
                .success(true)
                .message("Feature flag retrieved successfully")
                .data(data)
                .timestamp(java.time.LocalDateTime.now(clock))
                .build();
                
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{key}/toggle")
    public ResponseEntity<ApiResponse<FeatureFlagResponse>> toggleFeatureFlag(
            @PathVariable String key,
            Authentication authentication) {
            
        UUID authenticatedProjectId = getProjectIdFromAuthentication(authentication);
        FeatureFlagResponse data = featureFlagService.toggleFeatureFlag(authenticatedProjectId, key);
        
        ApiResponse<FeatureFlagResponse> response = ApiResponse.<FeatureFlagResponse>builder()
                .success(true)
                .message("Feature flag toggled successfully")
                .data(data)
                .timestamp(java.time.LocalDateTime.now(clock))
                .build();
                
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteFeatureFlag(
            @PathVariable UUID id,
            Authentication authentication) {
            
        UUID authenticatedProjectId = getProjectIdFromAuthentication(authentication);
        featureFlagService.deleteFeatureFlag(authenticatedProjectId, id);
        
        ApiResponse<Void> response = ApiResponse.<Void>builder()
                .success(true)
                .message("Feature flag deleted successfully")
                .timestamp(java.time.LocalDateTime.now(clock))
                .build();
                
        return ResponseEntity.ok(response);
    }

    private UUID getProjectIdFromAuthentication(Authentication authentication) {
        if (authentication == null || authentication.getPrincipal() == null) {
            throw new IllegalArgumentException("Authentication required. Please provide a valid API Key.");
        }
        
        if (authentication.getPrincipal() instanceof UUID) {
            return (UUID) authentication.getPrincipal();
        }
        
        throw new IllegalArgumentException("Invalid authentication principal type.");
    }
}
