package com.developerplatform.project.mapper;

import com.developerplatform.project.dto.request.CreateProjectRequest;
import com.developerplatform.project.dto.response.ProjectResponse;
import com.developerplatform.project.entity.Project;
import com.developerplatform.project.enums.ProjectStatus;

public final class ProjectMapper {

    private ProjectMapper() {
        // Private constructor to prevent instantiation
    }

    public static Project toEntity(CreateProjectRequest request) {
        if (request == null) {
            return null;
        }

        return Project.builder()
                .workspaceId(request.getWorkspaceId())
                .name(request.getName())
                .description(request.getDescription())
                .status(ProjectStatus.ACTIVE)
                .build();
    }

    public static ProjectResponse toResponse(Project project) {
        if (project == null) {
            return null;
        }

        return ProjectResponse.builder()
                .id(project.getId())
                .workspaceId(project.getWorkspaceId())
                .name(project.getName())
                .description(project.getDescription())
                .status(project.getStatus())
                .createdAt(project.getCreatedAt())
                .updatedAt(project.getUpdatedAt())
                .build();
    }
}
