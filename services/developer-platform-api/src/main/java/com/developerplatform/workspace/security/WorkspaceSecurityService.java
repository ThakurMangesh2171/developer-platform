package com.developerplatform.workspace.security;

import com.developerplatform.common.enums.ErrorCode;
import com.developerplatform.common.exception.ForbiddenException;
import com.developerplatform.common.exception.ResourceNotFoundException;
import com.developerplatform.workspace.entity.WorkspaceMember;
import com.developerplatform.workspace.enums.WorkspaceRole;
import com.developerplatform.workspace.repository.WorkspaceMemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class WorkspaceSecurityService {

    private final WorkspaceMemberRepository workspaceMemberRepository;

    public WorkspaceMember verifyAccess(UUID workspaceId, UUID userId, WorkspaceRole requiredRole) {
        WorkspaceMember member = workspaceMemberRepository.findByWorkspaceIdAndUserIdAndDeletedAtIsNull(workspaceId, userId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        ErrorCode.RESOURCE_NOT_FOUND,
                        "Workspace not found or you do not have access to it."
                ));

        if (requiredRole == WorkspaceRole.ADMIN && member.getRole() != WorkspaceRole.ADMIN) {
            throw new ForbiddenException(
                    ErrorCode.FORBIDDEN,
                    "You must be an ADMIN of this workspace to perform this action."
            );
        }

        if (requiredRole == WorkspaceRole.MEMBER && member.getRole() == WorkspaceRole.VIEWER) {
            throw new ForbiddenException(
                    ErrorCode.FORBIDDEN,
                    "You must be an ADMIN or MEMBER of this workspace to perform this action."
            );
        }

        return member;
    }
}
