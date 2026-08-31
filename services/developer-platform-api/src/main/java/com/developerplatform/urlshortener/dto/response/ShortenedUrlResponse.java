package com.developerplatform.urlshortener.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ShortenedUrlResponse {
    private UUID id;
    private UUID projectId;
    private String originalUrl;
    private String shortCode;
    private String shortUrl;
    private String title;
    private Long clickCount;
    private LocalDateTime expiresAt;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
