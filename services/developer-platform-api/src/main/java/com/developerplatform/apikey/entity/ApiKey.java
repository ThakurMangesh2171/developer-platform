package com.developerplatform.apikey.entity;

import com.developerplatform.apikey.enums.ApiKeyStatus;
import com.developerplatform.common.entity.UuidEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(
        name = "api_keys",
        indexes = {
                @Index(name = "idx_api_keys_project_id", columnList = "project_id"),
                @Index(name = "idx_api_keys_status", columnList = "status")
        }
)
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class ApiKey extends UuidEntity {

    @Column(name = "project_id", nullable = false)
    private UUID projectId;

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Column(name = "key_prefix", nullable = false, unique = true, length = 20)
    private String keyPrefix;

    @Column(name = "key_hash", nullable = false, length = 255)
    private String keyHash;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 50)
    private ApiKeyStatus status;

    @Column(name = "expires_at")
    private LocalDateTime expiresAt;

    @Column(name = "last_used_at")
    private LocalDateTime lastUsedAt;
}
