package com.developerplatform.apikey.repository;

import com.developerplatform.apikey.entity.ApiKey;
import com.developerplatform.apikey.enums.ApiKeyStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ApiKeyRepository extends JpaRepository<ApiKey, UUID> {

    List<ApiKey> findByProjectIdAndDeletedAtIsNull(UUID projectId);
    
    long countByProjectIdInAndDeletedAtIsNull(List<UUID> projectIds);

    Optional<ApiKey> findByIdAndDeletedAtIsNull(UUID id);

    Optional<ApiKey> findByKeyPrefixAndStatusAndDeletedAtIsNull(String keyPrefix, ApiKeyStatus status);
}
