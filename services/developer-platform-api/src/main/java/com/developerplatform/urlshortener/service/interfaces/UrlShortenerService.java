package com.developerplatform.urlshortener.service.interfaces;

import com.developerplatform.urlshortener.dto.request.CreateUrlRequest;
import com.developerplatform.urlshortener.dto.response.ShortenedUrlResponse;

import java.util.List;
import java.util.UUID;

public interface UrlShortenerService {

    ShortenedUrlResponse createShortUrl(UUID projectId, CreateUrlRequest request, String baseUrl);

    String resolveShortUrl(String shortCode, String ipAddress, String userAgent);

    List<ShortenedUrlResponse> getProjectUrls(UUID projectId, String baseUrl);
}
