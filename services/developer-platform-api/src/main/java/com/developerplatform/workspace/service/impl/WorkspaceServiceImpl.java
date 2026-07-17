package com.developerplatform.workspace.service.impl;

import com.developerplatform.common.enums.ErrorCode;
import com.developerplatform.common.constants.messages.WorkspaceMessages;
import com.developerplatform.common.exception.ConflictException;
import com.developerplatform.common.exception.ResourceNotFoundException;
import com.developerplatform.workspace.dto.request.CreateWorkspaceRequest;
import com.developerplatform.workspace.dto.request.UpdateWorkspaceRequest;
import com.developerplatform.workspace.dto.response.WorkspaceResponse;
import com.developerplatform.workspace.entity.Workspace;
import com.developerplatform.workspace.enums.WorkspaceStatus;
import com.developerplatform.workspace.mapper.WorkspaceMapper;
import com.developerplatform.workspace.repository.WorkspaceRepository;
import com.developerplatform.workspace.service.interfaces.WorkspaceService;
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
        return WorkspaceMapper.toResponse(savedWorkspace);
    }

    @Override
    @Transactional(readOnly = true)
    public WorkspaceResponse getWorkspace(UUID userId, UUID workspaceId) {
        Workspace workspace = workspaceRepository.findByIdAndUserIdAndStatusNot(workspaceId, userId, WorkspaceStatus.ARCHIVED)
                .orElseThrow(() -> new ResourceNotFoundException(
                        ErrorCode.WORKSPACE_NOT_FOUND,
                        WorkspaceMessages.WORKSPACE_NOT_FOUND
                ));
        return WorkspaceMapper.toResponse(workspace);
    }

    @Override
    @Transactional(readOnly = true)
    public List<WorkspaceResponse> getUserWorkspaces(UUID userId) {
        List<Workspace> workspaces = workspaceRepository.findByUserIdAndStatusNot(userId, WorkspaceStatus.ARCHIVED);
        return workspaces.stream()
                .map(WorkspaceMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public WorkspaceResponse updateWorkspace(UUID userId, UUID workspaceId, UpdateWorkspaceRequest request) {
        Workspace workspace = workspaceRepository.findByIdAndUserIdAndStatusNot(workspaceId, userId, WorkspaceStatus.ARCHIVED)
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
        Workspace workspace = workspaceRepository.findByIdAndUserIdAndStatusNot(workspaceId, userId, WorkspaceStatus.ARCHIVED)
                .orElseThrow(() -> new ResourceNotFoundException(
                        ErrorCode.WORKSPACE_NOT_FOUND,
                        WorkspaceMessages.WORKSPACE_NOT_FOUND
                ));

        workspace.setStatus(WorkspaceStatus.ARCHIVED);
        workspace.setDeletedAt(LocalDateTime.now());
        workspaceRepository.save(workspace);
    }
}
