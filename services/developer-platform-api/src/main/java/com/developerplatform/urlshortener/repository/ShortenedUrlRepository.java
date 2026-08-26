package com.developerplatform.urlshortener.repository;

import com.developerplatform.urlshortener.entity.ShortenedUrl;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ShortenedUrlRepository extends JpaRepository<ShortenedUrl, UUID> {
    Optional<ShortenedUrl> findByShortCodeAndDeletedAtIsNull(String shortCode);
    List<ShortenedUrl> findByProjectIdAndDeletedAtIsNull(UUID projectId);
    
    long countByProjectIdInAndDeletedAtIsNull(List<UUID> projectIds);
    
    @Query("SELECT COALESCE(SUM(s.clickCount), 0) FROM ShortenedUrl s WHERE s.projectId IN :projectIds AND s.deletedAt IS NULL")
    long sumClicksByProjectIdIn(@Param("projectIds") List<UUID> projectIds);
}
