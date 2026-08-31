package com.developerplatform.urlshortener.service.impl;

import com.developerplatform.common.enums.ErrorCode;
import com.developerplatform.common.exception.ResourceNotFoundException;
import com.developerplatform.urlshortener.dto.response.ClickDataPoint;
import com.developerplatform.urlshortener.dto.response.UrlAnalyticsResponse;
import com.developerplatform.urlshortener.entity.ShortenedUrl;
import com.developerplatform.urlshortener.entity.UrlClick;
import com.developerplatform.urlshortener.repository.ShortenedUrlRepository;
import com.developerplatform.urlshortener.repository.UrlClickRepository;
import com.developerplatform.urlshortener.service.interfaces.UrlAnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UrlAnalyticsServiceImpl implements UrlAnalyticsService {

    private final ShortenedUrlRepository shortenedUrlRepository;
    private final UrlClickRepository urlClickRepository;

    @Override
    @Transactional(readOnly = true)
    public UrlAnalyticsResponse getUrlAnalytics(UUID projectId, String shortCode) {
        ShortenedUrl shortenedUrl = shortenedUrlRepository.findByShortCodeAndDeletedAtIsNull(shortCode)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.RESOURCE_NOT_FOUND, "Short URL not found"));

        if (!shortenedUrl.getProjectId().equals(projectId)) {
            throw new IllegalArgumentException("Short URL does not belong to the specified project");
        }

        // Get clicks for the last 30 days
        LocalDateTime start = LocalDateTime.now().minusDays(30).with(LocalTime.MIN);
        LocalDateTime end = LocalDateTime.now().with(LocalTime.MAX);
        
        List<UrlClick> clicks = urlClickRepository.findByShortenedUrlIdAndClickedAtBetweenAndDeletedAtIsNull(
                shortenedUrl.getId(), start, end);

        // Group clicks by date
        Map<LocalDate, Long> clicksByDate = clicks.stream()
                .collect(Collectors.groupingBy(
                        click -> click.getClickedAt().toLocalDate(),
                        Collectors.counting()
                ));

        // Generate data points for the last 30 days including empty days
        List<ClickDataPoint> dataPoints = new ArrayList<>();
        for (int i = 29; i >= 0; i--) {
            LocalDate date = LocalDate.now().minusDays(i);
            dataPoints.add(new ClickDataPoint(date, clicksByDate.getOrDefault(date, 0L)));
        }

        return UrlAnalyticsResponse.builder()
                .shortCode(shortenedUrl.getShortCode())
                .originalUrl(shortenedUrl.getOriginalUrl())
                .totalClicks(shortenedUrl.getClickCount())
                .clicksOverTime(dataPoints)
                .build();
    }
}
