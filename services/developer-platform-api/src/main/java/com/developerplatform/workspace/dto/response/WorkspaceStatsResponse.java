package com.developerplatform.workspace.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WorkspaceStatsResponse {
    private long totalProjects;
    private long totalApiKeys;
    private long totalShortenedUrls;
    private long totalUrlClicks;
}
