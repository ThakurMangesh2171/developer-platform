package com.developerplatform.workspace.mapper;

import com.developerplatform.workspace.dto.request.CreateWorkspaceRequest;
import com.developerplatform.workspace.dto.response.WorkspaceResponse;
import com.developerplatform.workspace.entity.Workspace;
import com.developerplatform.workspace.enums.WorkspaceStatus;

import java.util.UUID;

public final class WorkspaceMapper {

    private WorkspaceMapper() {
        // Private constructor to prevent instantiation
    }

    public static Workspace toEntity(CreateWorkspaceRequest request, UUID userId) {
        if (request == null) {
            return null;
        }

        return Workspace.builder()
                .userId(userId)
                .name(request.getName())
                .description(request.getDescription())
                .status(WorkspaceStatus.ACTIVE)
                .build();
    }

    public static WorkspaceResponse toResponse(Workspace workspace) {
        if (workspace == null) {
            return null;
        }

        return WorkspaceResponse.builder()
                .id(workspace.getId())
                .userId(workspace.getUserId())
                .name(workspace.getName())
                .description(workspace.getDescription())
                .status(workspace.getStatus())
                .createdAt(workspace.getCreatedAt())
                .updatedAt(workspace.getUpdatedAt())
                .build();
    }
}
