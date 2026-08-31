package com.developerplatform.urlshortener.controller;

import com.developerplatform.common.constants.ApiPaths;
import com.developerplatform.urlshortener.dto.response.UrlAnalyticsResponse;
import com.developerplatform.urlshortener.service.interfaces.UrlAnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping(ApiPaths.URLS)
@RequiredArgsConstructor
public class UrlAnalyticsController {

    private final UrlAnalyticsService urlAnalyticsService;

    @GetMapping("/{shortCode}/analytics")
    public ResponseEntity<UrlAnalyticsResponse> getUrlAnalytics(
            @PathVariable String shortCode,
            Authentication authentication) {
            
        UUID projectId = getProjectIdFromAuthentication(authentication);
        UrlAnalyticsResponse response = urlAnalyticsService.getUrlAnalytics(projectId, shortCode);
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
