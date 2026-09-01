package com.developerplatform.featureflag.utils;

import com.developerplatform.common.enums.ErrorCode;
import com.developerplatform.common.exception.ConflictException;
import com.developerplatform.featureflag.repository.FeatureFlagRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
@RequiredArgsConstructor
@Slf4j
public class FeatureFlagValidationUtils {

    private final FeatureFlagRepository featureFlagRepository;

    public void validateFeatureFlagKeyForCreation(UUID projectId, String key) {
        if (featureFlagRepository.existsByProjectIdAndKeyAndDeletedAtIsNull(projectId, key)) {
            log.warn("Validation failed. Feature flag already exists with key '{}' in project ID {}", key, projectId);
            throw new ConflictException(
                    ErrorCode.BAD_REQUEST,
                    "A feature flag with this key already exists in this project."
            );
        }
    }
}
