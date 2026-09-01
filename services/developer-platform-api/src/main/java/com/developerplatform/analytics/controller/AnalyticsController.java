package com.developerplatform.analytics.controller;

import com.developerplatform.analytics.dto.response.ProjectAnalyticsResponse;
import com.developerplatform.analytics.service.interfaces.UsageAnalyticsService;
import com.developerplatform.common.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/projects/{projectId}/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final java.time.Clock clock;
    private final UsageAnalyticsService usageAnalyticsService;

    @GetMapping
    public ResponseEntity<ApiResponse<ProjectAnalyticsResponse>> getProjectAnalytics(@PathVariable UUID projectId) {
        ProjectAnalyticsResponse data = usageAnalyticsService.getProjectAnalytics(projectId);
        
        ApiResponse<ProjectAnalyticsResponse> response = ApiResponse.<ProjectAnalyticsResponse>builder()
                .success(true)
                .message("Project analytics retrieved successfully")
                .data(data)
                .timestamp(java.time.LocalDateTime.now(clock))
                .build();
                
        return ResponseEntity.ok(response);
    }
}
