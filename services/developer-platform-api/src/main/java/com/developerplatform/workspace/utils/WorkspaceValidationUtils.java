package com.developerplatform.workspace.utils;

import com.developerplatform.common.constants.messages.WorkspaceMessages;
import com.developerplatform.common.enums.ErrorCode;
import com.developerplatform.common.exception.ConflictException;
import com.developerplatform.common.exception.ResourceNotFoundException;
import com.developerplatform.workspace.entity.Workspace;
import com.developerplatform.workspace.enums.WorkspaceStatus;
import com.developerplatform.workspace.repository.WorkspaceRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
@RequiredArgsConstructor
@Slf4j
public class WorkspaceValidationUtils {

    private final WorkspaceRepository workspaceRepository;

    public void validateWorkspaceNameForCreation(UUID userId, String name) {
        if (workspaceRepository.existsByUserIdAndNameAndStatusNot(userId, name, WorkspaceStatus.ARCHIVED)) {
            log.warn("Validation failed. Workspace already exists with name '{}' for user ID {}", name, userId);
            throw new ConflictException(
                    ErrorCode.WORKSPACE_ALREADY_EXISTS,
                    WorkspaceMessages.WORKSPACE_ALREADY_EXISTS
            );
        }
    }

    public void validateWorkspaceNameForUpdate(UUID userId, UUID workspaceId, String newName) {
        Workspace workspace = workspaceRepository.findByIdAndStatusNot(workspaceId, WorkspaceStatus.ARCHIVED)
                .orElseThrow(() -> new ResourceNotFoundException(
                        ErrorCode.WORKSPACE_NOT_FOUND,
                        WorkspaceMessages.WORKSPACE_NOT_FOUND
                ));

        if (!workspace.getName().equalsIgnoreCase(newName)) {
            validateWorkspaceNameForCreation(userId, newName);
        }
    }
}
