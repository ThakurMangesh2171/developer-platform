package com.developerplatform.workspace.service.interfaces;

import com.developerplatform.workspace.dto.request.CreateWorkspaceRequest;
import com.developerplatform.workspace.dto.request.UpdateWorkspaceRequest;
import com.developerplatform.workspace.dto.response.WorkspaceResponse;
import com.developerplatform.workspace.dto.response.WorkspaceStatsResponse;

import java.util.List;
import java.util.UUID;

public interface WorkspaceService {

    WorkspaceResponse createWorkspace(UUID userId, CreateWorkspaceRequest request);

    WorkspaceResponse getWorkspace(UUID userId, UUID workspaceId);

    List<WorkspaceResponse> getUserWorkspaces(UUID userId);

    WorkspaceResponse updateWorkspace(UUID userId, UUID workspaceId, UpdateWorkspaceRequest request);

    void deleteWorkspace(UUID userId, UUID workspaceId);
    
    WorkspaceStatsResponse getWorkspaceStats(UUID userId, UUID workspaceId);
}
