package com.developerplatform.featureflag.service.impl;

import com.developerplatform.common.constants.messages.FeatureFlagMessages;
import com.developerplatform.common.enums.ErrorCode;
import com.developerplatform.common.exception.ResourceNotFoundException;
import com.developerplatform.featureflag.dto.request.CreateFeatureFlagRequest;
import com.developerplatform.featureflag.dto.response.FeatureFlagResponse;
import com.developerplatform.featureflag.entity.FeatureFlag;
import com.developerplatform.featureflag.mapper.FeatureFlagMapper;
import com.developerplatform.featureflag.repository.FeatureFlagRepository;
import com.developerplatform.featureflag.service.interfaces.FeatureFlagService;
import com.developerplatform.webhook.service.WebhookService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FeatureFlagServiceImpl implements FeatureFlagService {

    private final FeatureFlagRepository featureFlagRepository;
    private final FeatureFlagMapper featureFlagMapper;
    private final WebhookService webhookService;
    private final java.time.Clock clock;

    @Override
    @Transactional
    public FeatureFlagResponse createFeatureFlag(UUID projectId, CreateFeatureFlagRequest request) {
        FeatureFlag flag = featureFlagMapper.toEntity(request, projectId);
        FeatureFlag savedFlag = featureFlagRepository.save(flag);
        
        FeatureFlagResponse response = featureFlagMapper.toResponse(savedFlag);
        webhookService.dispatchEvent(projectId, "feature_flag.created", response);
        return response;
    }

    @Override
    @Transactional(readOnly = true)
    public List<FeatureFlagResponse> getProjectFeatureFlags(UUID projectId) {
        return featureFlagRepository.findByProjectIdAndDeletedAtIsNull(projectId)
                .stream()
                .map(featureFlagMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public FeatureFlagResponse getFeatureFlag(UUID projectId, String key) {
        FeatureFlag flag = featureFlagRepository.findByProjectIdAndKeyAndDeletedAtIsNull(projectId, key)
                .orElseThrow(() -> new ResourceNotFoundException(
                        ErrorCode.RESOURCE_NOT_FOUND,
                        FeatureFlagMessages.FLAG_NOT_FOUND
                ));
                
        return featureFlagMapper.toResponse(flag);
    }

    @Override
    @Transactional
    public FeatureFlagResponse toggleFeatureFlag(UUID projectId, String key) {
        FeatureFlag flag = featureFlagRepository.findByProjectIdAndKeyAndDeletedAtIsNull(projectId, key)
                .orElseThrow(() -> new ResourceNotFoundException(
                        ErrorCode.RESOURCE_NOT_FOUND,
                        FeatureFlagMessages.FLAG_NOT_FOUND
                ));
                
        flag.setEnabled(!flag.isEnabled());
        FeatureFlag savedFlag = featureFlagRepository.save(flag);
        
        FeatureFlagResponse response = featureFlagMapper.toResponse(savedFlag);
        webhookService.dispatchEvent(projectId, "feature_flag.toggled", response);
        return response;
    }

    @Override
    @Transactional
    public void deleteFeatureFlag(UUID projectId, UUID flagId) {
        FeatureFlag flag = featureFlagRepository.findByIdAndProjectIdAndDeletedAtIsNull(flagId, projectId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        ErrorCode.RESOURCE_NOT_FOUND,
                        FeatureFlagMessages.FLAG_NOT_FOUND
                ));
                
        flag.setDeletedAt(LocalDateTime.now(clock));
        featureFlagRepository.save(flag);
    }
}
