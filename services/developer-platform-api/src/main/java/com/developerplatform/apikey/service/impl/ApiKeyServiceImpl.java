package com.developerplatform.apikey.service.impl;

import com.developerplatform.apikey.dto.request.CreateApiKeyRequest;
import com.developerplatform.apikey.dto.response.ApiKeyResponse;
import com.developerplatform.apikey.dto.response.CreateApiKeyResponse;
import com.developerplatform.apikey.entity.ApiKey;
import com.developerplatform.apikey.enums.ApiKeyStatus;
import com.developerplatform.apikey.mapper.ApiKeyMapper;
import com.developerplatform.apikey.repository.ApiKeyRepository;
import com.developerplatform.apikey.service.interfaces.ApiKeyService;
import com.developerplatform.common.constants.messages.ApiKeyMessages;
import com.developerplatform.common.constants.messages.ProjectMessages;
import com.developerplatform.common.constants.messages.WorkspaceMessages;
import com.developerplatform.common.enums.ErrorCode;
import com.developerplatform.common.exception.ResourceNotFoundException;
import com.developerplatform.common.util.ApiKeyUtils;
import com.developerplatform.project.entity.Project;
import com.developerplatform.project.enums.ProjectStatus;
import com.developerplatform.project.repository.ProjectRepository;
import com.developerplatform.workspace.enums.WorkspaceStatus;
import com.developerplatform.workspace.repository.WorkspaceRepository;
import com.developerplatform.workspace.entity.WorkspaceMember;
import com.developerplatform.workspace.enums.WorkspaceRole;
import com.developerplatform.notification.enums.NotificationType;
import com.developerplatform.notification.service.NotificationService;
import com.developerplatform.workspace.repository.WorkspaceMemberRepository;
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
public class ApiKeyServiceImpl implements ApiKeyService {

    private final ApiKeyRepository apiKeyRepository;
    private final ProjectRepository projectRepository;
    private final WorkspaceRepository workspaceRepository;
    private final WorkspaceMemberRepository workspaceMemberRepository;
    private final NotificationService notificationService;
    private final java.time.Clock clock;

    @Override
    @Transactional
    public CreateApiKeyResponse createApiKey(UUID userId, CreateApiKeyRequest request) {
        validateProjectAccess(userId, request.getProjectId(), List.of(WorkspaceRole.ADMIN, WorkspaceRole.MEMBER));

        String rawKey = ApiKeyUtils.generateRawKey();
        String prefix = ApiKeyUtils.extractPrefix(rawKey);
        String hash = ApiKeyUtils.hashKey(rawKey);

        ApiKey apiKey = ApiKey.builder()
                .projectId(request.getProjectId())
                .name(request.getName())
                .keyPrefix(prefix)
                .keyHash(hash)
                .status(ApiKeyStatus.ACTIVE)
                .expiresAt(request.getExpiresAt())
                .build();

        ApiKey savedApiKey = apiKeyRepository.save(apiKey);
        
        notificationService.createNotification(
                userId,
                "API Key Generated",
                "A new API key '" + request.getName() + "' was generated for project ID: " + request.getProjectId(),
                NotificationType.SECURITY
        );

        return ApiKeyMapper.toCreateResponse(savedApiKey, rawKey);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ApiKeyResponse> getProjectApiKeys(UUID userId, UUID projectId) {
        validateProjectAccess(userId, projectId, List.of(WorkspaceRole.ADMIN, WorkspaceRole.MEMBER, WorkspaceRole.VIEWER));

        List<ApiKey> apiKeys = apiKeyRepository.findByProjectIdAndDeletedAtIsNull(projectId);
        return apiKeys.stream()
                .map(ApiKeyMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void revokeApiKey(UUID userId, UUID apiKeyId) {
        ApiKey apiKey = apiKeyRepository.findByIdAndDeletedAtIsNull(apiKeyId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        ErrorCode.API_KEY_NOT_FOUND,
                        ApiKeyMessages.API_KEY_NOT_FOUND
                ));

        validateProjectAccess(userId, apiKey.getProjectId(), List.of(WorkspaceRole.ADMIN, WorkspaceRole.MEMBER));

        apiKey.setStatus(ApiKeyStatus.REVOKED);
        apiKey.setDeletedAt(LocalDateTime.now(clock));
        apiKeyRepository.save(apiKey);
    }

    private void validateProjectAccess(UUID userId, UUID projectId, List<WorkspaceRole> allowedRoles) {
        Project project = projectRepository.findByIdAndStatusNot(projectId, ProjectStatus.ARCHIVED)
                .orElseThrow(() -> new ResourceNotFoundException(
                        ErrorCode.PROJECT_NOT_FOUND,
                        ProjectMessages.PROJECT_NOT_FOUND
                ));

        workspaceRepository.findByIdAndStatusNot(project.getWorkspaceId(), WorkspaceStatus.ARCHIVED)
                .orElseThrow(() -> new ResourceNotFoundException(
                        ErrorCode.WORKSPACE_NOT_FOUND,
                        WorkspaceMessages.WORKSPACE_NOT_FOUND
                ));
                
        WorkspaceMember member = workspaceMemberRepository.findByWorkspaceIdAndUserIdAndDeletedAtIsNull(project.getWorkspaceId(), userId)
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
