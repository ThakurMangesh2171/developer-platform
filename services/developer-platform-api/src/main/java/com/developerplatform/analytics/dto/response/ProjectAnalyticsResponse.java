package com.developerplatform.analytics.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProjectAnalyticsResponse {
    private long totalRequestsUsed;
    private long totalUrlClicks;
    private long totalQuota;
    private List<DailyUsage> usageHistory;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DailyUsage {
        private String date; // YYYY-MM-DD
        private long requests;
        private long urlClicks;
    }
}
