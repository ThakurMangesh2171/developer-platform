package com.developerplatform.urlshortener.controller;

import com.developerplatform.common.constants.ApiPaths;
import com.developerplatform.urlshortener.dto.request.CreateUrlRequest;
import com.developerplatform.common.response.ApiResponse;
import com.developerplatform.urlshortener.dto.response.ShortenedUrlResponse;
import com.developerplatform.urlshortener.service.interfaces.UrlShortenerService;
import com.developerplatform.urlshortener.utils.UrlShortenerValidationUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping(ApiPaths.URLS)
@RequiredArgsConstructor
public class UrlShortenerController {

    private final java.time.Clock clock;
    private final UrlShortenerService urlShortenerService;
    private final UrlShortenerValidationUtils urlShortenerValidationUtils;
    
    @Value("${app.base-url}")
    private String baseUrl;

    @PostMapping
    public ResponseEntity<ApiResponse<ShortenedUrlResponse>> createShortUrl(
            @Valid @RequestBody CreateUrlRequest request,
            @RequestParam(required = false) UUID projectId,
            Authentication authentication) {
        
        UUID authenticatedProjectId = getProjectIdFromAuthentication(authentication);
        if (projectId != null && !projectId.equals(authenticatedProjectId)) {
            throw new IllegalArgumentException("The provided API Key does not belong to this project.");
        }
        
        urlShortenerValidationUtils.validateCustomAliasUnique(request.getCustomAlias());
        ShortenedUrlResponse data = urlShortenerService.createShortUrl(authenticatedProjectId, request, baseUrl);
        
        ApiResponse<ShortenedUrlResponse> response = ApiResponse.<ShortenedUrlResponse>builder()
                .success(true)
                .message("Short URL created successfully")
                .data(data)
                .timestamp(java.time.LocalDateTime.now(clock))
                .build();
                
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ShortenedUrlResponse>>> getProjectUrls(
            @RequestParam(required = false) UUID projectId,
            Authentication authentication) {
            
        UUID authenticatedProjectId = getProjectIdFromAuthentication(authentication);
        if (projectId != null && !projectId.equals(authenticatedProjectId)) {
            throw new IllegalArgumentException("The provided API Key does not belong to this project.");
        }
        
        List<ShortenedUrlResponse> data = urlShortenerService.getProjectUrls(authenticatedProjectId, baseUrl);
        
        ApiResponse<List<ShortenedUrlResponse>> response = ApiResponse.<List<ShortenedUrlResponse>>builder()
                .success(true)
                .message("Short URLs retrieved successfully")
                .data(data)
                .timestamp(java.time.LocalDateTime.now(clock))
                .build();
                
        return ResponseEntity.ok(response);
    }

    private UUID getProjectIdFromAuthentication(Authentication authentication) {
        if (authentication == null || authentication.getPrincipal() == null) {
            throw new IllegalArgumentException("Authentication required. Please provide a valid API Key.");
        }
        
        if (authentication.getPrincipal() instanceof UUID uuid) {
            return uuid;
        }
        
        throw new IllegalArgumentException("Invalid authentication principal type.");
    }
}
