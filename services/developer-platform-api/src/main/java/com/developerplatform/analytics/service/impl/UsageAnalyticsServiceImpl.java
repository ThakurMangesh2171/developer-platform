package com.developerplatform.analytics.service.impl;

import com.developerplatform.analytics.dto.response.ProjectAnalyticsResponse;
import com.developerplatform.analytics.service.interfaces.UsageAnalyticsService;
import com.developerplatform.urlshortener.entity.ShortenedUrl;
import com.developerplatform.urlshortener.entity.UrlClick;
import com.developerplatform.urlshortener.repository.ShortenedUrlRepository;
import com.developerplatform.urlshortener.repository.UrlClickRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class UsageAnalyticsServiceImpl implements UsageAnalyticsService {

    private final RedisTemplate<String, String> redisTemplate;
    private final ShortenedUrlRepository shortenedUrlRepository;
    private final UrlClickRepository urlClickRepository;
    
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
        long totalUrlClicksThisMonth = 0;

        LocalDate today = LocalDate.now();
        DateTimeFormatter formatter = DateTimeFormatter.ISO_LOCAL_DATE;
        
        List<UUID> shortUrlIds = shortenedUrlRepository.findByProjectIdAndDeletedAtIsNull(projectId)
                .stream().map(ShortenedUrl::getId).collect(Collectors.toList());

        // Fetch data for the last 7 days for the chart
        for (int i = 6; i >= 0; i--) {
            LocalDate date = today.minusDays(i);
            String dateStr = date.format(formatter);
            String redisKey = "usage:" + projectId + ":" + dateStr;
            
            String countStr = redisTemplate.opsForValue().get(redisKey);
            long requestsCount = (countStr != null) ? Long.parseLong(countStr) : 0L;
            
            long clicksCount = 0;
            if (!shortUrlIds.isEmpty()) {
                LocalDateTime startOfDay = date.atStartOfDay();
                LocalDateTime endOfDay = date.atTime(LocalTime.MAX);
                clicksCount = urlClickRepository.findByShortenedUrlIdInAndClickedAtBetweenAndDeletedAtIsNull(
                        shortUrlIds, startOfDay, endOfDay).size();
            }
            
            usageHistory.add(ProjectAnalyticsResponse.DailyUsage.builder()
                    .date(dateStr)
                    .requests(requestsCount)
                    .urlClicks(clicksCount)
                    .build());
                    
            totalRequestsThisMonth += requestsCount;
            totalUrlClicksThisMonth += clicksCount;
        }

        return ProjectAnalyticsResponse.builder()
                .totalRequestsUsed(totalRequestsThisMonth)
                .totalUrlClicks(totalUrlClicksThisMonth)
                .totalQuota(FREE_TIER_QUOTA)
                .usageHistory(usageHistory)
                .build();
    }
}
