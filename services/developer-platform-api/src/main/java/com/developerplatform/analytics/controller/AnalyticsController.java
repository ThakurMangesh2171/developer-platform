package com.developerplatform.analytics.controller;

import com.developerplatform.analytics.dto.response.ProjectAnalyticsResponse;
import com.developerplatform.analytics.service.interfaces.UsageAnalyticsService;
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

    private final UsageAnalyticsService usageAnalyticsService;

    @GetMapping
    public ResponseEntity<ProjectAnalyticsResponse> getProjectAnalytics(@PathVariable UUID projectId) {
        ProjectAnalyticsResponse response = usageAnalyticsService.getProjectAnalytics(projectId);
        return ResponseEntity.ok(response);
    }
}
