package com.developerplatform.urlshortener.service.interfaces;

import com.developerplatform.urlshortener.dto.response.UrlAnalyticsResponse;

import java.util.UUID;

public interface UrlAnalyticsService {
    UrlAnalyticsResponse getUrlAnalytics(UUID projectId, String shortCode);
}
