package com.developerplatform.project.entity;

import com.developerplatform.common.entity.UuidEntity;
import com.developerplatform.project.enums.ProjectStatus;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
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
        name = "projects",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uq_projects_workspace_name",
                        columnNames = {"workspace_id", "name"}
                )
        },
        indexes = {
                @Index(name = "idx_projects_workspace_id", columnList = "workspace_id"),
                @Index(name = "idx_projects_status", columnList = "status")
        }
)
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class Project extends UuidEntity {

    @Column(name = "workspace_id", nullable = false)
    private UUID workspaceId;

    @Column(name = "name", nullable = false, length = 150)
    private String name;

    @Column(name = "description", length = 500)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 50)
    private ProjectStatus status;
}
