package com.developerplatform.project.service.impl;

import com.developerplatform.common.enums.ErrorCode;
import com.developerplatform.common.constants.messages.ProjectMessages;
import com.developerplatform.common.constants.messages.WorkspaceMessages;
import com.developerplatform.common.exception.ConflictException;
import com.developerplatform.common.exception.ResourceNotFoundException;
import com.developerplatform.project.dto.request.CreateProjectRequest;
import com.developerplatform.project.dto.request.UpdateProjectRequest;
import com.developerplatform.project.dto.response.ProjectResponse;
import com.developerplatform.project.entity.Project;
import com.developerplatform.project.enums.ProjectStatus;
import com.developerplatform.project.mapper.ProjectMapper;
import com.developerplatform.project.repository.ProjectRepository;
import com.developerplatform.project.service.interfaces.ProjectService;
import com.developerplatform.workspace.enums.WorkspaceStatus;
import com.developerplatform.workspace.repository.WorkspaceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProjectServiceImpl implements ProjectService {

    private final ProjectRepository projectRepository;
    private final WorkspaceRepository workspaceRepository;

    @Override
    @Transactional
    public ProjectResponse createProject(UUID userId, CreateProjectRequest request) {
        validateWorkspaceOwnership(userId, request.getWorkspaceId());

        if (projectRepository.existsByWorkspaceIdAndNameAndStatusNot(request.getWorkspaceId(), request.getName(), ProjectStatus.ARCHIVED)) {
            throw new ConflictException(
                    ErrorCode.PROJECT_ALREADY_EXISTS,
                    ProjectMessages.PROJECT_ALREADY_EXISTS
            );
        }

        Project project = ProjectMapper.toEntity(request);
        Project savedProject = projectRepository.save(project);
        return ProjectMapper.toResponse(savedProject);
    }

    @Override
    @Transactional(readOnly = true)
    public ProjectResponse getProject(UUID userId, UUID projectId) {
        Project project = getProjectAndValidateOwnership(userId, projectId);
        return ProjectMapper.toResponse(project);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProjectResponse> getWorkspaceProjects(UUID userId, UUID workspaceId) {
        validateWorkspaceOwnership(userId, workspaceId);

        List<Project> projects = projectRepository.findByWorkspaceIdAndStatusNot(workspaceId, ProjectStatus.ARCHIVED);
        return projects.stream()
                .map(ProjectMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ProjectResponse updateProject(UUID userId, UUID projectId, UpdateProjectRequest request) {
        Project project = getProjectAndValidateOwnership(userId, projectId);

        // If name has changed, verify uniqueness within the workspace
        if (!project.getName().equalsIgnoreCase(request.getName())) {
            if (projectRepository.existsByWorkspaceIdAndNameAndStatusNot(project.getWorkspaceId(), request.getName(), ProjectStatus.ARCHIVED)) {
                throw new ConflictException(
                        ErrorCode.PROJECT_ALREADY_EXISTS,
                        ProjectMessages.PROJECT_ALREADY_EXISTS
                );
            }
        }

        project.setName(request.getName());
        project.setDescription(request.getDescription());
        Project updatedProject = projectRepository.save(project);
        return ProjectMapper.toResponse(updatedProject);
    }

    @Override
    @Transactional
    public void deleteProject(UUID userId, UUID projectId) {
        Project project = getProjectAndValidateOwnership(userId, projectId);

        project.setStatus(ProjectStatus.ARCHIVED);
        project.setDeletedAt(LocalDateTime.now());
        projectRepository.save(project);
    }

    private void validateWorkspaceOwnership(UUID userId, UUID workspaceId) {
        workspaceRepository.findByIdAndUserIdAndStatusNot(workspaceId, userId, WorkspaceStatus.ARCHIVED)
                .orElseThrow(() -> new ResourceNotFoundException(
                        ErrorCode.WORKSPACE_NOT_FOUND,
                        WorkspaceMessages.WORKSPACE_NOT_FOUND
                ));
    }

    private Project getProjectAndValidateOwnership(UUID userId, UUID projectId) {
        Project project = projectRepository.findByIdAndStatusNot(projectId, ProjectStatus.ARCHIVED)
                .orElseThrow(() -> new ResourceNotFoundException(
                        ErrorCode.PROJECT_NOT_FOUND,
                        ProjectMessages.PROJECT_NOT_FOUND
                ));
        validateWorkspaceOwnership(userId, project.getWorkspaceId());
        return project;
    }
}
