package com.developerplatform.featureflag.service.impl;

import com.developerplatform.common.enums.ErrorCode;
import com.developerplatform.common.exception.ConflictException;
import com.developerplatform.common.exception.ResourceNotFoundException;
import com.developerplatform.featureflag.dto.request.CreateFeatureFlagRequest;
import com.developerplatform.featureflag.dto.response.FeatureFlagResponse;
import com.developerplatform.featureflag.entity.FeatureFlag;
import com.developerplatform.featureflag.mapper.FeatureFlagMapper;
import com.developerplatform.featureflag.repository.FeatureFlagRepository;
import com.developerplatform.featureflag.service.interfaces.FeatureFlagService;
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

    @Override
    @Transactional
    public FeatureFlagResponse createFeatureFlag(UUID projectId, CreateFeatureFlagRequest request) {
        if (featureFlagRepository.existsByProjectIdAndKeyAndDeletedAtIsNull(projectId, request.getKey())) {
            throw new ConflictException(
                    ErrorCode.BAD_REQUEST,
                    "A feature flag with this key already exists in this project."
            );
        }

        FeatureFlag flag = featureFlagMapper.toEntity(request, projectId);
        FeatureFlag savedFlag = featureFlagRepository.save(flag);
        
        return featureFlagMapper.toResponse(savedFlag);
    }

    @Override
    @Transactional(readOnly = true)
    public List<FeatureFlagResponse> getProjectFeatureFlags(UUID projectId) {
        return featureFlagRepository.findByProjectIdAndDeletedAtIsNull(projectId)
                .stream()
                .map(featureFlagMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public FeatureFlagResponse getFeatureFlag(UUID projectId, String key) {
        FeatureFlag flag = featureFlagRepository.findByProjectIdAndKeyAndDeletedAtIsNull(projectId, key)
                .orElseThrow(() -> new ResourceNotFoundException(
                        ErrorCode.RESOURCE_NOT_FOUND,
                        "Feature flag not found"
                ));
                
        return featureFlagMapper.toResponse(flag);
    }

    @Override
    @Transactional
    public FeatureFlagResponse toggleFeatureFlag(UUID projectId, String key) {
        FeatureFlag flag = featureFlagRepository.findByProjectIdAndKeyAndDeletedAtIsNull(projectId, key)
                .orElseThrow(() -> new ResourceNotFoundException(
                        ErrorCode.RESOURCE_NOT_FOUND,
                        "Feature flag not found"
                ));
                
        flag.setEnabled(!flag.isEnabled());
        FeatureFlag savedFlag = featureFlagRepository.save(flag);
        
        return featureFlagMapper.toResponse(savedFlag);
    }

    @Override
    @Transactional
    public void deleteFeatureFlag(UUID projectId, UUID flagId) {
        FeatureFlag flag = featureFlagRepository.findByIdAndProjectIdAndDeletedAtIsNull(flagId, projectId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        ErrorCode.RESOURCE_NOT_FOUND,
                        "Feature flag not found"
                ));
                
        flag.setDeletedAt(LocalDateTime.now());
        featureFlagRepository.save(flag);
    }
}
