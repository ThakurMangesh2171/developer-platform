package com.developerplatform.analytics.service.interfaces;

import com.developerplatform.analytics.dto.response.ProjectAnalyticsResponse;

import java.util.UUID;

public interface UsageAnalyticsService {
    
    /**
     * Tracks an API request for the given project.
     *
     * @param projectId The ID of the project making the request
     */
    void trackRequest(UUID projectId);
    
    /**
     * Retrieves the analytics for a given project for the past 7 days.
     *
     * @param projectId The ID of the project
     * @return The analytics response
     */
    ProjectAnalyticsResponse getProjectAnalytics(UUID projectId);
}
