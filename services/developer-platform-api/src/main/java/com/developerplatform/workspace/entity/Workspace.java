package com.developerplatform.workspace.entity;

import com.developerplatform.common.entity.UuidEntity;
import com.developerplatform.workspace.enums.WorkspaceStatus;
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
        name = "workspaces",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uq_workspaces_user_name",
                        columnNames = {"user_id", "name"}
                )
        },
        indexes = {
                @Index(name = "idx_workspaces_user_id", columnList = "user_id"),
                @Index(name = "idx_workspaces_status", columnList = "status")
        }
)
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class Workspace extends UuidEntity {

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(name = "name", nullable = false, length = 150)
    private String name;

    @Column(name = "description", length = 500)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 50)
    private WorkspaceStatus status;
}
