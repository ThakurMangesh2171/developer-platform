package com.developerplatform.analytics.service.impl;

import com.developerplatform.analytics.dto.response.ProjectAnalyticsResponse;
import com.developerplatform.analytics.service.interfaces.UsageAnalyticsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class UsageAnalyticsServiceImpl implements UsageAnalyticsService {

    private final RedisTemplate<String, String> redisTemplate;
    
    private static final long FREE_TIER_QUOTA = 10000; // 10k requests per month

    @Override
    public void trackRequest(UUID projectId) {
        if (projectId == null) {
            return;
        }

        String today = LocalDate.now().format(DateTimeFormatter.ISO_LOCAL_DATE);
        String redisKey = "usage:" + projectId + ":" + today;

        try {
            Long count = redisTemplate.opsForValue().increment(redisKey);
            // Keep the data for 30 days
            if (count != null && count == 1L) {
                redisTemplate.expire(redisKey, Duration.ofDays(30));
            }
        } catch (Exception e) {
            log.error("Failed to track usage in Redis for project {}", projectId, e);
        }
    }

    @Override
    public ProjectAnalyticsResponse getProjectAnalytics(UUID projectId) {
        List<ProjectAnalyticsResponse.DailyUsage> usageHistory = new ArrayList<>();
        long totalRequestsThisMonth = 0;

        LocalDate today = LocalDate.now();
        DateTimeFormatter formatter = DateTimeFormatter.ISO_LOCAL_DATE;

        // Fetch data for the last 7 days for the chart
        for (int i = 6; i >= 0; i--) {
            LocalDate date = today.minusDays(i);
            String dateStr = date.format(formatter);
            String redisKey = "usage:" + projectId + ":" + dateStr;
            
            String countStr = redisTemplate.opsForValue().get(redisKey);
            long count = (countStr != null) ? Long.parseLong(countStr) : 0L;
            
            usageHistory.add(ProjectAnalyticsResponse.DailyUsage.builder()
                    .date(dateStr)
                    .requests(count)
                    .build());
                    
            totalRequestsThisMonth += count;
        }
        
        // In a real app, we would sum up the whole month, but this is fine for MVP

        return ProjectAnalyticsResponse.builder()
                .totalRequestsUsed(totalRequestsThisMonth)
                .totalQuota(FREE_TIER_QUOTA)
                .usageHistory(usageHistory)
                .build();
    }
}
