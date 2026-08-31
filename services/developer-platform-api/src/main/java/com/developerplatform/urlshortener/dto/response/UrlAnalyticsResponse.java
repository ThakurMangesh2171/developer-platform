package com.developerplatform.urlshortener.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UrlAnalyticsResponse {
    private String shortCode;
    private String originalUrl;
    private long totalClicks;
    private List<ClickDataPoint> clicksOverTime;
}
