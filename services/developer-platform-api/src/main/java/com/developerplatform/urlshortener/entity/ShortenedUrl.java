package com.developerplatform.urlshortener.entity;

import com.developerplatform.common.entity.UuidEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "short_urls", indexes = {
        @Index(name = "idx_short_urls_project_id", columnList = "project_id"),
        @Index(name = "idx_short_urls_short_code", columnList = "short_code", unique = true)
})
@Getter
@Setter
@NoArgsConstructor
@ToString(callSuper = true)
public class ShortenedUrl extends UuidEntity {

    @Column(name = "project_id", nullable = false)
    private UUID projectId;

    @Column(name = "original_url", nullable = false, columnDefinition = "TEXT")
    private String originalUrl;

    @Column(name = "short_code", nullable = false, length = 20, unique = true)
    private String shortCode;

    @Column(name = "title", length = 255)
    private String title;

    @Column(name = "click_count", nullable = false)
    private Long clickCount = 0L;

    @Column(name = "expires_at")
    private LocalDateTime expiresAt;

    @Column(name = "status", nullable = false, length = 50)
    private String status = "ACTIVE";
}
