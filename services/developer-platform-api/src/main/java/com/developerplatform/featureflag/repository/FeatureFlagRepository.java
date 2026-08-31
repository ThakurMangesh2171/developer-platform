package com.developerplatform.featureflag.repository;

import com.developerplatform.featureflag.entity.FeatureFlag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface FeatureFlagRepository extends JpaRepository<FeatureFlag, UUID> {
    
    List<FeatureFlag> findByProjectIdAndDeletedAtIsNull(UUID projectId);
    
    Optional<FeatureFlag> findByProjectIdAndKeyAndDeletedAtIsNull(UUID projectId, String key);
    
    boolean existsByProjectIdAndKeyAndDeletedAtIsNull(UUID projectId, String key);
    
    Optional<FeatureFlag> findByIdAndProjectIdAndDeletedAtIsNull(UUID id, UUID projectId);
}
