package com.developerplatform.urlshortener.service.impl;

import com.developerplatform.common.enums.ErrorCode;
import com.developerplatform.common.constants.messages.UrlShortenerMessages;
import com.developerplatform.common.exception.ResourceNotFoundException;
import com.developerplatform.urlshortener.dto.request.CreateUrlRequest;
import com.developerplatform.urlshortener.dto.response.ShortenedUrlResponse;
import com.developerplatform.urlshortener.entity.ShortenedUrl;
import com.developerplatform.urlshortener.entity.UrlClick;
import com.developerplatform.urlshortener.repository.UrlClickRepository;
import com.developerplatform.urlshortener.repository.ShortenedUrlRepository;
import com.developerplatform.urlshortener.service.interfaces.UrlShortenerService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class UrlShortenerServiceImpl implements UrlShortenerService {

    private final ShortenedUrlRepository shortenedUrlRepository;
    private final UrlClickRepository urlClickRepository;
    private final java.time.Clock clock;
    
    private static final String BASE62_CHARS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    private static final SecureRandom RANDOM = new SecureRandom();

    @Override
    @Transactional
    @org.springframework.cache.annotation.CacheEvict(value = com.developerplatform.common.config.CacheConfig.URL_CACHE, key = "#projectId")
    public ShortenedUrlResponse createShortUrl(UUID projectId, CreateUrlRequest request, String baseUrl) {
        String shortCode;
        if (request.getCustomAlias() != null && !request.getCustomAlias().trim().isEmpty()) {
            shortCode = request.getCustomAlias().trim();
        } else {
            shortCode = generateUniqueShortCode();
        }
        
        if (request.getExpiresAt() != null && request.getExpiresAt().isAfter(LocalDateTime.now(clock).plusYears(1))) {
            throw new IllegalArgumentException(UrlShortenerMessages.EXPIRATION_DATE_TOO_FAR);
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
    public String resolveShortUrl(String shortCode, String ipAddress, String userAgent) {
        ShortenedUrl shortenedUrl = shortenedUrlRepository.findByShortCodeAndDeletedAtIsNull(shortCode)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.RESOURCE_NOT_FOUND, UrlShortenerMessages.URL_NOT_FOUND));
        
        if (shortenedUrl.getExpiresAt() != null && shortenedUrl.getExpiresAt().isBefore(LocalDateTime.now(clock))) {
            throw new ResourceNotFoundException(ErrorCode.RESOURCE_NOT_FOUND, UrlShortenerMessages.URL_EXPIRED);
        }
        
        // Save analytics
        UrlClick click = UrlClick.builder()
                .shortenedUrlId(shortenedUrl.getId())
                .ipAddress(ipAddress != null && ipAddress.length() > 45 ? ipAddress.substring(0, 45) : ipAddress)
                .userAgent(userAgent)
                .clickedAt(LocalDateTime.now(clock))
                .build();
        urlClickRepository.save(click);

        // Increment click count
        shortenedUrl.setClickCount(shortenedUrl.getClickCount() + 1);
        shortenedUrlRepository.save(shortenedUrl);
        
        return shortenedUrl.getOriginalUrl();
    }

    @Override
    @Transactional(readOnly = true)
    @org.springframework.cache.annotation.Cacheable(value = com.developerplatform.common.config.CacheConfig.URL_CACHE, key = "#projectId")
    public List<ShortenedUrlResponse> getProjectUrls(UUID projectId, String baseUrl) {
        return shortenedUrlRepository.findByProjectIdAndDeletedAtIsNull(projectId).stream()
                .map(url -> mapToResponse(url, baseUrl))
                .toList();
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
