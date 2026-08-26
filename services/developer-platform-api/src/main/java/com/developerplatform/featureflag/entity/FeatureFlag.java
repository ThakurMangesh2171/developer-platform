package com.developerplatform.featureflag.entity;

import com.developerplatform.common.entity.UuidEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.util.UUID;

@Entity
@Table(
        name = "feature_flags",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_feature_flags_project_key",
                        columnNames = {"project_id", "flag_key"}
                )
        },
        indexes = {
                @Index(name = "idx_feature_flags_project_id", columnList = "project_id"),
                @Index(name = "idx_feature_flags_key", columnList = "flag_key")
        }
)
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class FeatureFlag extends UuidEntity {

    @Column(name = "project_id", nullable = false)
    private UUID projectId;

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Column(name = "flag_key", nullable = false, length = 100)
    private String key;

    @Column(name = "description")
    private String description;

    @Column(name = "is_enabled", nullable = false)
    private boolean enabled;
}
