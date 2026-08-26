package com.developerplatform.featureflag.mapper;

import com.developerplatform.featureflag.dto.request.CreateFeatureFlagRequest;
import com.developerplatform.featureflag.dto.response.FeatureFlagResponse;
import com.developerplatform.featureflag.entity.FeatureFlag;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class FeatureFlagMapper {

    public FeatureFlag toEntity(CreateFeatureFlagRequest request, UUID projectId) {
        if (request == null) return null;
        
        return FeatureFlag.builder()
                .projectId(projectId)
                .name(request.getName())
                .key(request.getKey())
                .description(request.getDescription())
                .enabled(request.isEnabled())
                .build();
    }

    public FeatureFlagResponse toResponse(FeatureFlag entity) {
        if (entity == null) return null;
        
        return FeatureFlagResponse.builder()
                .id(entity.getId())
                .projectId(entity.getProjectId())
                .name(entity.getName())
                .key(entity.getKey())
                .description(entity.getDescription())
                .enabled(entity.isEnabled())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }
}
