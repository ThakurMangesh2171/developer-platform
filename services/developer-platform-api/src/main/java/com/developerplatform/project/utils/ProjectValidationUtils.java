package com.developerplatform.project.utils;

import com.developerplatform.common.constants.messages.ProjectMessages;
import com.developerplatform.common.enums.ErrorCode;
import com.developerplatform.common.exception.ConflictException;
import com.developerplatform.common.exception.ResourceNotFoundException;
import com.developerplatform.project.entity.Project;
import com.developerplatform.project.enums.ProjectStatus;
import com.developerplatform.project.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
@RequiredArgsConstructor
@Slf4j
public class ProjectValidationUtils {

    private final ProjectRepository projectRepository;

    public void validateProjectNameForCreation(UUID workspaceId, String name) {
        if (projectRepository.existsByWorkspaceIdAndNameAndStatusNot(workspaceId, name, ProjectStatus.ARCHIVED)) {
            log.warn("Validation failed. Project already exists with name '{}' in workspace ID {}", name, workspaceId);
            throw new ConflictException(
                    ErrorCode.PROJECT_ALREADY_EXISTS,
                    ProjectMessages.PROJECT_ALREADY_EXISTS
            );
        }
    }

    public void validateProjectNameForUpdate(UUID projectId, String newName) {
        Project project = projectRepository.findByIdAndStatusNot(projectId, ProjectStatus.ARCHIVED)
                .orElseThrow(() -> new ResourceNotFoundException(
                        ErrorCode.PROJECT_NOT_FOUND,
                        ProjectMessages.PROJECT_NOT_FOUND
                ));

        if (!project.getName().equalsIgnoreCase(newName)) {
            validateProjectNameForCreation(project.getWorkspaceId(), newName);
        }
    }
}
