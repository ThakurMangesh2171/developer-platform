package com.developerplatform.featureflag.service.interfaces;

import com.developerplatform.featureflag.dto.request.CreateFeatureFlagRequest;
import com.developerplatform.featureflag.dto.response.FeatureFlagResponse;

import java.util.List;
import java.util.UUID;

public interface FeatureFlagService {

    FeatureFlagResponse createFeatureFlag(UUID projectId, CreateFeatureFlagRequest request);

    List<FeatureFlagResponse> getProjectFeatureFlags(UUID projectId);

    FeatureFlagResponse getFeatureFlag(UUID projectId, String key);

    FeatureFlagResponse toggleFeatureFlag(UUID projectId, String key);
    
    void deleteFeatureFlag(UUID projectId, UUID flagId);
}
