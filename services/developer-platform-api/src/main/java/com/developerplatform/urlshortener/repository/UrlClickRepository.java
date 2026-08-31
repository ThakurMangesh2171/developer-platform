package com.developerplatform.urlshortener.repository;

import com.developerplatform.urlshortener.entity.UrlClick;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface UrlClickRepository extends JpaRepository<UrlClick, UUID> {
    
    List<UrlClick> findByShortenedUrlIdAndClickedAtBetweenAndDeletedAtIsNull(
            UUID shortenedUrlId, LocalDateTime start, LocalDateTime end);
            
    long countByShortenedUrlIdAndDeletedAtIsNull(UUID shortenedUrlId);
}
