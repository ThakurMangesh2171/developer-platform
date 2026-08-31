package com.developerplatform.urlshortener.entity;

import com.developerplatform.common.entity.UuidEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "url_clicks", indexes = {
        @Index(name = "idx_url_clicks_shortened_url_id", columnList = "shortened_url_id"),
        @Index(name = "idx_url_clicks_clicked_at", columnList = "clicked_at")
})
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class UrlClick extends UuidEntity {

    @Column(name = "shortened_url_id", nullable = false)
    private UUID shortenedUrlId;

    @Column(name = "clicked_at", nullable = false)
    private LocalDateTime clickedAt;

    @Column(name = "ip_address", length = 45)
    private String ipAddress;

    @Column(name = "user_agent", columnDefinition = "TEXT")
    private String userAgent;
}
