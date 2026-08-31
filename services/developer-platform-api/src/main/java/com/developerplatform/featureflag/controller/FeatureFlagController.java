package com.developerplatform.featureflag.controller;

import com.developerplatform.common.constants.ApiPaths;
import com.developerplatform.featureflag.dto.request.CreateFeatureFlagRequest;
import com.developerplatform.featureflag.dto.response.FeatureFlagResponse;
import com.developerplatform.featureflag.service.interfaces.FeatureFlagService;
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

    private final FeatureFlagService featureFlagService;

    @PostMapping
    public ResponseEntity<FeatureFlagResponse> createFeatureFlag(
            @Valid @RequestBody CreateFeatureFlagRequest request,
            @RequestParam(required = false) UUID projectId,
            Authentication authentication) {
        
        UUID authenticatedProjectId = getProjectIdFromAuthentication(authentication);
        if (projectId != null && !projectId.equals(authenticatedProjectId)) {
            throw new IllegalArgumentException("The provided API Key does not belong to this project.");
        }
        
        FeatureFlagResponse response = featureFlagService.createFeatureFlag(authenticatedProjectId, request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<FeatureFlagResponse>> getProjectFeatureFlags(
            @RequestParam(required = false) UUID projectId,
            Authentication authentication) {
            
        UUID authenticatedProjectId = getProjectIdFromAuthentication(authentication);
        if (projectId != null && !projectId.equals(authenticatedProjectId)) {
            throw new IllegalArgumentException("The provided API Key does not belong to this project.");
        }
        
        List<FeatureFlagResponse> response = featureFlagService.getProjectFeatureFlags(authenticatedProjectId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{key}")
    public ResponseEntity<FeatureFlagResponse> getFeatureFlag(
            @PathVariable String key,
            Authentication authentication) {
            
        UUID authenticatedProjectId = getProjectIdFromAuthentication(authentication);
        FeatureFlagResponse response = featureFlagService.getFeatureFlag(authenticatedProjectId, key);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{key}/toggle")
    public ResponseEntity<FeatureFlagResponse> toggleFeatureFlag(
            @PathVariable String key,
            Authentication authentication) {
            
        UUID authenticatedProjectId = getProjectIdFromAuthentication(authentication);
        FeatureFlagResponse response = featureFlagService.toggleFeatureFlag(authenticatedProjectId, key);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFeatureFlag(
            @PathVariable UUID id,
            Authentication authentication) {
            
        UUID authenticatedProjectId = getProjectIdFromAuthentication(authentication);
        featureFlagService.deleteFeatureFlag(authenticatedProjectId, id);
        return ResponseEntity.noContent().build();
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
