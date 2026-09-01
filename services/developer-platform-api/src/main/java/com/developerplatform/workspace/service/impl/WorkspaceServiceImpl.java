package com.developerplatform.workspace.service.impl;

import com.developerplatform.common.enums.ErrorCode;
import com.developerplatform.common.constants.messages.WorkspaceMessages;
import com.developerplatform.common.exception.ConflictException;
import com.developerplatform.common.exception.ResourceNotFoundException;
import com.developerplatform.workspace.dto.request.CreateWorkspaceRequest;
import com.developerplatform.workspace.dto.request.UpdateWorkspaceRequest;
import com.developerplatform.workspace.dto.response.WorkspaceResponse;
import com.developerplatform.workspace.dto.response.WorkspaceStatsResponse;
import com.developerplatform.workspace.entity.Workspace;
import com.developerplatform.workspace.enums.WorkspaceStatus;
import com.developerplatform.workspace.mapper.WorkspaceMapper;
import com.developerplatform.workspace.repository.WorkspaceRepository;
import com.developerplatform.workspace.service.interfaces.WorkspaceService;
import com.developerplatform.project.repository.ProjectRepository;
import com.developerplatform.project.enums.ProjectStatus;
import com.developerplatform.project.entity.Project;
import com.developerplatform.apikey.repository.ApiKeyRepository;
import com.developerplatform.urlshortener.repository.ShortenedUrlRepository;
import com.developerplatform.workspace.entity.WorkspaceMember;
import com.developerplatform.workspace.enums.WorkspaceRole;
import com.developerplatform.workspace.enums.WorkspaceMemberStatus;
import com.developerplatform.workspace.repository.WorkspaceMemberRepository;
import com.developerplatform.auth.repository.UserRepository;
import com.developerplatform.auth.entity.User;
import com.developerplatform.common.exception.ForbiddenException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WorkspaceServiceImpl implements WorkspaceService {

    private final WorkspaceRepository workspaceRepository;
    private final WorkspaceMemberRepository workspaceMemberRepository;
    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final ApiKeyRepository apiKeyRepository;
    private final ShortenedUrlRepository shortenedUrlRepository;

    @Override
    @Transactional
    public WorkspaceResponse createWorkspace(UUID userId, CreateWorkspaceRequest request) {
        if (workspaceRepository.existsByUserIdAndNameAndStatusNot(userId, request.getName(), WorkspaceStatus.ARCHIVED)) {
            throw new ConflictException(
                    ErrorCode.WORKSPACE_ALREADY_EXISTS,
                    WorkspaceMessages.WORKSPACE_ALREADY_EXISTS
            );
        }

        Workspace workspace = WorkspaceMapper.toEntity(request, userId);
        Workspace savedWorkspace = workspaceRepository.save(workspace);
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.RESOURCE_NOT_FOUND, "User not found"));
                
        WorkspaceMember member = WorkspaceMember.builder()
                .workspace(savedWorkspace)
                .user(user)
                .role(WorkspaceRole.ADMIN)
                .status(WorkspaceMemberStatus.ACTIVE)
                .build();
        workspaceMemberRepository.save(member);
        
        return WorkspaceMapper.toResponse(savedWorkspace);
    }

    @Override
    @Transactional(readOnly = true)
    public WorkspaceResponse getWorkspace(UUID userId, UUID workspaceId) {
        verifyUserIsWorkspaceMember(workspaceId, userId);
        
        Workspace workspace = workspaceRepository.findByIdAndStatusNot(workspaceId, WorkspaceStatus.ARCHIVED)
                .orElseThrow(() -> new ResourceNotFoundException(
                        ErrorCode.WORKSPACE_NOT_FOUND,
                        WorkspaceMessages.WORKSPACE_NOT_FOUND
                ));
        return WorkspaceMapper.toResponse(workspace);
    }

    @Override
    @Transactional(readOnly = true)
    public List<WorkspaceResponse> getUserWorkspaces(UUID userId) {
        List<WorkspaceMember> members = workspaceMemberRepository.findByUserIdAndDeletedAtIsNull(userId);
        return members.stream()
                .map(WorkspaceMember::getWorkspace)
                .filter(w -> w.getStatus() != WorkspaceStatus.ARCHIVED)
                .map(WorkspaceMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public WorkspaceResponse updateWorkspace(UUID userId, UUID workspaceId, UpdateWorkspaceRequest request) {
        verifyUserHasWorkspaceRole(workspaceId, userId, List.of(WorkspaceRole.ADMIN));
        
        Workspace workspace = workspaceRepository.findByIdAndStatusNot(workspaceId, WorkspaceStatus.ARCHIVED)
                .orElseThrow(() -> new ResourceNotFoundException(
                        ErrorCode.WORKSPACE_NOT_FOUND,
                        WorkspaceMessages.WORKSPACE_NOT_FOUND
                ));

        // If the name has changed, verify uniqueness
        if (!workspace.getName().equalsIgnoreCase(request.getName())) {
            if (workspaceRepository.existsByUserIdAndNameAndStatusNot(userId, request.getName(), WorkspaceStatus.ARCHIVED)) {
                throw new ConflictException(
                        ErrorCode.WORKSPACE_ALREADY_EXISTS,
                        WorkspaceMessages.WORKSPACE_ALREADY_EXISTS
                );
            }
        }

        workspace.setName(request.getName());
        workspace.setDescription(request.getDescription());
        Workspace updatedWorkspace = workspaceRepository.save(workspace);
        return WorkspaceMapper.toResponse(updatedWorkspace);
    }

    @Override
    @Transactional
    public void deleteWorkspace(UUID userId, UUID workspaceId) {
        verifyUserHasWorkspaceRole(workspaceId, userId, List.of(WorkspaceRole.ADMIN));
        
        Workspace workspace = workspaceRepository.findByIdAndStatusNot(workspaceId, WorkspaceStatus.ARCHIVED)
                .orElseThrow(() -> new ResourceNotFoundException(
                        ErrorCode.WORKSPACE_NOT_FOUND,
                        WorkspaceMessages.WORKSPACE_NOT_FOUND
                ));

        workspace.setStatus(WorkspaceStatus.ARCHIVED);
        workspace.setDeletedAt(LocalDateTime.now());
        workspaceRepository.save(workspace);
    }
    
    @Override
    @Transactional(readOnly = true)
    public WorkspaceStatsResponse getWorkspaceStats(UUID userId, UUID workspaceId) {
        verifyUserIsWorkspaceMember(workspaceId, userId);
        
        // Verify workspace exists
        workspaceRepository.findByIdAndStatusNot(workspaceId, WorkspaceStatus.ARCHIVED)
                .orElseThrow(() -> new ResourceNotFoundException(
                        ErrorCode.WORKSPACE_NOT_FOUND,
                        WorkspaceMessages.WORKSPACE_NOT_FOUND
                ));
                
        long totalProjects = projectRepository.countByWorkspaceIdAndStatusNot(workspaceId, ProjectStatus.ARCHIVED);
        
        List<UUID> projectIds = projectRepository.findByWorkspaceIdAndStatusNot(workspaceId, ProjectStatus.ARCHIVED)
                .stream().map(Project::getId).collect(Collectors.toList());
                
        long totalApiKeys = 0;
        long totalShortenedUrls = 0;
        long totalUrlClicks = 0;
        
        if (!projectIds.isEmpty()) {
            totalApiKeys = apiKeyRepository.countByProjectIdInAndDeletedAtIsNull(projectIds);
            totalShortenedUrls = shortenedUrlRepository.countByProjectIdInAndDeletedAtIsNull(projectIds);
            totalUrlClicks = shortenedUrlRepository.sumClicksByProjectIdIn(projectIds);
        }
        
        return WorkspaceStatsResponse.builder()
                .totalProjects(totalProjects)
                .totalApiKeys(totalApiKeys)
                .totalShortenedUrls(totalShortenedUrls)
                .totalUrlClicks(totalUrlClicks)
                .build();
    }
    
    private void verifyUserIsWorkspaceMember(UUID workspaceId, UUID userId) {
        if (!workspaceMemberRepository.existsByWorkspaceIdAndUserIdAndDeletedAtIsNull(workspaceId, userId)) {
            throw new ForbiddenException(
                    ErrorCode.FORBIDDEN,
                    "You do not have access to this workspace."
            );
        }
    }
    
    private void verifyUserHasWorkspaceRole(UUID workspaceId, UUID userId, List<WorkspaceRole> allowedRoles) {
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
}
