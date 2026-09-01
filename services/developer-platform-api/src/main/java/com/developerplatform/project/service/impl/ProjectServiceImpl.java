package com.developerplatform.project.service.impl;

import com.developerplatform.common.enums.ErrorCode;
import com.developerplatform.common.constants.messages.ProjectMessages;
import com.developerplatform.common.constants.messages.WorkspaceMessages;
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
import com.developerplatform.workspace.entity.WorkspaceMember;
import com.developerplatform.workspace.enums.WorkspaceRole;
import com.developerplatform.workspace.repository.WorkspaceMemberRepository;
import com.developerplatform.common.exception.ForbiddenException;
import com.developerplatform.common.config.CacheConfig;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
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
    private final WorkspaceMemberRepository workspaceMemberRepository;
    private final java.time.Clock clock;

    @Override
    @Transactional
    public ProjectResponse createProject(UUID userId, CreateProjectRequest request) {
        validateWorkspaceAccess(userId, request.getWorkspaceId(), List.of(WorkspaceRole.ADMIN, WorkspaceRole.MEMBER));

        Project project = ProjectMapper.toEntity(request);
        Project savedProject = projectRepository.save(project);
        return ProjectMapper.toResponse(savedProject);
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = CacheConfig.PROJECT_CACHE, key = "#projectId")
    public ProjectResponse getProject(UUID userId, UUID projectId) {
        Project project = getProjectAndValidateAccess(userId, projectId, List.of(WorkspaceRole.ADMIN, WorkspaceRole.MEMBER, WorkspaceRole.VIEWER));
        return ProjectMapper.toResponse(project);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProjectResponse> getWorkspaceProjects(UUID userId, UUID workspaceId) {
        validateWorkspaceAccess(userId, workspaceId, List.of(WorkspaceRole.ADMIN, WorkspaceRole.MEMBER, WorkspaceRole.VIEWER));

        List<Project> projects = projectRepository.findByWorkspaceIdAndStatusNot(workspaceId, ProjectStatus.ARCHIVED);
        return projects.stream()
                .map(ProjectMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional
    @CachePut(value = CacheConfig.PROJECT_CACHE, key = "#projectId")
    public ProjectResponse updateProject(UUID userId, UUID projectId, UpdateProjectRequest request) {
        Project project = getProjectAndValidateAccess(userId, projectId, List.of(WorkspaceRole.ADMIN, WorkspaceRole.MEMBER));

        project.setName(request.getName());
        project.setDescription(request.getDescription());
        Project updatedProject = projectRepository.save(project);
        return ProjectMapper.toResponse(updatedProject);
    }

    @Override
    @Transactional
    @CacheEvict(value = CacheConfig.PROJECT_CACHE, key = "#projectId")
    public void deleteProject(UUID userId, UUID projectId) {
        Project project = getProjectAndValidateAccess(userId, projectId, List.of(WorkspaceRole.ADMIN, WorkspaceRole.MEMBER));

        project.setStatus(ProjectStatus.ARCHIVED);
        project.setDeletedAt(LocalDateTime.now(clock));
        projectRepository.save(project);
    }

    private void validateWorkspaceAccess(UUID userId, UUID workspaceId, List<WorkspaceRole> allowedRoles) {
        // Ensure workspace exists and isn't archived
        workspaceRepository.findByIdAndStatusNot(workspaceId, WorkspaceStatus.ARCHIVED)
                .orElseThrow(() -> new ResourceNotFoundException(
                        ErrorCode.WORKSPACE_NOT_FOUND,
                        WorkspaceMessages.WORKSPACE_NOT_FOUND
                ));
                
        // Ensure user is member and has correct role
        WorkspaceMember member = workspaceMemberRepository.findByWorkspaceIdAndUserIdAndDeletedAtIsNull(workspaceId, userId)
                .orElseThrow(() -> new ForbiddenException(
                        ErrorCode.FORBIDDEN,
                        "You do not have access to this workspace."
                ));
                
        if (!allowedRoles.contains(member.getRole())) {
            throw new ForbiddenException(
                    ErrorCode.FORBIDDEN,
                    "You do not have the required permissions for this action."
            );
        }
    }

    private Project getProjectAndValidateAccess(UUID userId, UUID projectId, List<WorkspaceRole> allowedRoles) {
        Project project = projectRepository.findByIdAndStatusNot(projectId, ProjectStatus.ARCHIVED)
                .orElseThrow(() -> new ResourceNotFoundException(
                        ErrorCode.PROJECT_NOT_FOUND,
                        ProjectMessages.PROJECT_NOT_FOUND
                ));
        validateWorkspaceAccess(userId, project.getWorkspaceId(), allowedRoles);
        return project;
    }
}
