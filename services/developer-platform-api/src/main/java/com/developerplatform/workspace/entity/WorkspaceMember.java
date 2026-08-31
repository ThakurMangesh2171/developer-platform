package com.developerplatform.workspace.entity;

import com.developerplatform.auth.entity.User;
import com.developerplatform.common.entity.UuidEntity;
import com.developerplatform.workspace.enums.WorkspaceMemberStatus;
import com.developerplatform.workspace.enums.WorkspaceRole;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Entity
@Table(
        name = "workspace_members",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uq_workspace_user",
                        columnNames = {"workspace_id", "user_id"}
                )
        },
        indexes = {
                @Index(name = "idx_wm_workspace_id", columnList = "workspace_id"),
                @Index(name = "idx_wm_user_id", columnList = "user_id")
        }
)
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class WorkspaceMember extends UuidEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "workspace_id", nullable = false)
    private Workspace workspace;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false, length = 50)
    private WorkspaceRole role;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 50)
    private WorkspaceMemberStatus status;
}
