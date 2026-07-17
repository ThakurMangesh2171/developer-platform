package com.developerplatform.project.service.interfaces;

import com.developerplatform.project.dto.request.CreateProjectRequest;
import com.developerplatform.project.dto.request.UpdateProjectRequest;
import com.developerplatform.project.dto.response.ProjectResponse;

import java.util.List;
import java.util.UUID;

public interface ProjectService {

    ProjectResponse createProject(UUID userId, CreateProjectRequest request);

    ProjectResponse getProject(UUID userId, UUID projectId);

    List<ProjectResponse> getWorkspaceProjects(UUID userId, UUID workspaceId);

    ProjectResponse updateProject(UUID userId, UUID projectId, UpdateProjectRequest request);

    void deleteProject(UUID userId, UUID projectId);
}
