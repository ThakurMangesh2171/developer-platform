package com.developerplatform.urlshortener.service.impl;

import com.developerplatform.common.enums.ErrorCode;
import com.developerplatform.common.exception.ResourceNotFoundException;
import com.developerplatform.urlshortener.dto.request.CreateUrlRequest;
import com.developerplatform.urlshortener.dto.response.ShortenedUrlResponse;
import com.developerplatform.urlshortener.entity.ShortenedUrl;
import com.developerplatform.urlshortener.repository.ShortenedUrlRepository;
import com.developerplatform.urlshortener.service.interfaces.UrlShortenerService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class UrlShortenerServiceImpl implements UrlShortenerService {

    private final ShortenedUrlRepository shortenedUrlRepository;
    private static final String BASE62_CHARS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    private static final SecureRandom RANDOM = new SecureRandom();

    @Override
    @Transactional
    public ShortenedUrlResponse createShortUrl(UUID projectId, CreateUrlRequest request, String baseUrl) {
        String shortCode = generateUniqueShortCode();
        
        if (request.getExpiresAt() != null && request.getExpiresAt().isAfter(java.time.LocalDateTime.now().plusYears(1))) {
            throw new IllegalArgumentException("Expiration date cannot be more than 1 year in the future.");
        }
        
        ShortenedUrl shortenedUrl = new ShortenedUrl();
        shortenedUrl.setProjectId(projectId);
        shortenedUrl.setOriginalUrl(request.getOriginalUrl());
        shortenedUrl.setTitle(request.getTitle());
        shortenedUrl.setShortCode(shortCode);
        shortenedUrl.setExpiresAt(request.getExpiresAt());
        
        ShortenedUrl savedUrl = shortenedUrlRepository.save(shortenedUrl);
        return mapToResponse(savedUrl, baseUrl);
    }

    @Override
    @Transactional
    public String resolveShortUrl(String shortCode) {
        ShortenedUrl shortenedUrl = shortenedUrlRepository.findByShortCodeAndDeletedAtIsNull(shortCode)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.RESOURCE_NOT_FOUND, "Short URL not found for code: " + shortCode));
        
        if (shortenedUrl.getExpiresAt() != null && shortenedUrl.getExpiresAt().isBefore(java.time.LocalDateTime.now())) {
            throw new ResourceNotFoundException(ErrorCode.RESOURCE_NOT_FOUND, "This short URL has expired.");
        }
        
        // Increment click count
        shortenedUrl.setClickCount(shortenedUrl.getClickCount() + 1);
        shortenedUrlRepository.save(shortenedUrl);
        
        return shortenedUrl.getOriginalUrl();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ShortenedUrlResponse> getProjectUrls(UUID projectId, String baseUrl) {
        return shortenedUrlRepository.findByProjectIdAndDeletedAtIsNull(projectId).stream()
                .map(url -> mapToResponse(url, baseUrl))
                .collect(Collectors.toList());
    }

    private String generateUniqueShortCode() {
        String code;
        do {
            code = generateRandomCode(7);
        } while (shortenedUrlRepository.findByShortCodeAndDeletedAtIsNull(code).isPresent());
        return code;
    }

    private String generateRandomCode(int length) {
        StringBuilder sb = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            sb.append(BASE62_CHARS.charAt(RANDOM.nextInt(BASE62_CHARS.length())));
        }
        return sb.toString();
    }

    private ShortenedUrlResponse mapToResponse(ShortenedUrl entity, String baseUrl) {
        return ShortenedUrlResponse.builder()
                .id(entity.getId())
                .projectId(entity.getProjectId())
                .originalUrl(entity.getOriginalUrl())
                .shortCode(entity.getShortCode())
                .shortUrl(baseUrl + "/r/" + entity.getShortCode())
                .title(entity.getTitle())
                .clickCount(entity.getClickCount())
                .expiresAt(entity.getExpiresAt())
                .status(entity.getStatus())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }
}
