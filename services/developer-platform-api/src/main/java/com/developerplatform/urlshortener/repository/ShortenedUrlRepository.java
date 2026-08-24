package com.developerplatform.urlshortener.repository;

import com.developerplatform.urlshortener.entity.ShortenedUrl;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ShortenedUrlRepository extends JpaRepository<ShortenedUrl, UUID> {
    Optional<ShortenedUrl> findByShortCodeAndDeletedAtIsNull(String shortCode);
    List<ShortenedUrl> findByProjectIdAndDeletedAtIsNull(UUID projectId);
}
