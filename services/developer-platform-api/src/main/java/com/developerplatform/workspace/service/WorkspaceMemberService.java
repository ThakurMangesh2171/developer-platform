package com.developerplatform.workspace.service;

import com.developerplatform.auth.entity.User;
import com.developerplatform.auth.repository.UserRepository;
import com.developerplatform.common.enums.ErrorCode;
import com.developerplatform.common.exception.ConflictException;
import com.developerplatform.common.exception.ResourceNotFoundException;
import com.developerplatform.notification.enums.NotificationType;
import com.developerplatform.notification.service.NotificationService;
import com.developerplatform.workspace.dto.InviteMemberRequest;
import com.developerplatform.workspace.dto.WorkspaceMemberResponse;
import com.developerplatform.workspace.entity.Workspace;
import com.developerplatform.workspace.entity.WorkspaceMember;
import com.developerplatform.workspace.enums.WorkspaceMemberStatus;
import com.developerplatform.workspace.enums.WorkspaceRole;
import com.developerplatform.workspace.repository.WorkspaceMemberRepository;
import com.developerplatform.workspace.repository.WorkspaceRepository;
import com.developerplatform.workspace.security.WorkspaceSecurityService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WorkspaceMemberService {

    private final WorkspaceMemberRepository workspaceMemberRepository;
    private final WorkspaceRepository workspaceRepository;
    private final UserRepository userRepository;
    private final WorkspaceSecurityService workspaceSecurityService;
    private final NotificationService notificationService;
    private final java.time.Clock clock;

    @Transactional(readOnly = true)
    public List<WorkspaceMemberResponse> getMembers(UUID workspaceId, UUID currentUserId) {
        workspaceSecurityService.verifyAccess(workspaceId, currentUserId, WorkspaceRole.VIEWER);

        return workspaceMemberRepository.findByWorkspaceIdAndDeletedAtIsNull(workspaceId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public WorkspaceMemberResponse inviteMember(UUID workspaceId, UUID currentUserId, InviteMemberRequest request) {
        workspaceSecurityService.verifyAccess(workspaceId, currentUserId, WorkspaceRole.ADMIN);

        User invitee = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException(
                        ErrorCode.RESOURCE_NOT_FOUND,
                        "User with email " + request.getEmail() + " not found. They must sign up first."
                ));

        if (workspaceMemberRepository.existsByWorkspaceIdAndUserIdAndDeletedAtIsNull(workspaceId, invitee.getId())) {
            throw new ConflictException(
                    ErrorCode.BAD_REQUEST,
                    "User is already a member of this workspace."
            );
        }

        Workspace workspace = workspaceRepository.findById(workspaceId)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.RESOURCE_NOT_FOUND, "Workspace not found"));

        WorkspaceMember newMember = WorkspaceMember.builder()
                .workspace(workspace)
                .user(invitee)
                .role(request.getRole() != null ? request.getRole() : WorkspaceRole.MEMBER)
                .status(WorkspaceMemberStatus.ACTIVE) // Auto-accepting for MVP
                .build();

        WorkspaceMember savedMember = workspaceMemberRepository.save(newMember);
        
        // Trigger notification
        notificationService.createNotification(
                invitee.getId(),
                "Workspace Invitation",
                "You have been invited to join the workspace: " + workspace.getName(),
                NotificationType.INVITE
        );

        return mapToResponse(savedMember);
    }

    @Transactional
    public WorkspaceMemberResponse updateRole(UUID workspaceId, UUID memberId, UUID currentUserId, WorkspaceRole newRole) {
        workspaceSecurityService.verifyAccess(workspaceId, currentUserId, WorkspaceRole.ADMIN);

        WorkspaceMember memberToUpdate = workspaceMemberRepository.findById(memberId)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.RESOURCE_NOT_FOUND, "Member not found"));
                
        if (!memberToUpdate.getWorkspace().getId().equals(workspaceId) || memberToUpdate.getDeletedAt() != null) {
            throw new ResourceNotFoundException(ErrorCode.RESOURCE_NOT_FOUND, "Member not found in this workspace");
        }
        
        // Prevent removing the last admin (basic check, could be more robust)
        if (memberToUpdate.getRole() == WorkspaceRole.ADMIN && newRole != WorkspaceRole.ADMIN) {
            long adminCount = workspaceMemberRepository.findByWorkspaceIdAndDeletedAtIsNull(workspaceId).stream()
                    .filter(m -> m.getRole() == WorkspaceRole.ADMIN)
                    .count();
            if (adminCount <= 1) {
                throw new ConflictException(ErrorCode.BAD_REQUEST, "Cannot remove the last admin of a workspace");
            }
        }

        memberToUpdate.setRole(newRole);
        return mapToResponse(workspaceMemberRepository.save(memberToUpdate));
    }

    @Transactional
    public void removeMember(UUID workspaceId, UUID memberId, UUID currentUserId) {
        workspaceSecurityService.verifyAccess(workspaceId, currentUserId, WorkspaceRole.ADMIN);

        WorkspaceMember memberToRemove = workspaceMemberRepository.findById(memberId)
                .orElseThrow(() -> new ResourceNotFoundException(ErrorCode.RESOURCE_NOT_FOUND, "Member not found"));
                
        if (!memberToRemove.getWorkspace().getId().equals(workspaceId) || memberToRemove.getDeletedAt() != null) {
            throw new ResourceNotFoundException(ErrorCode.RESOURCE_NOT_FOUND, "Member not found in this workspace");
        }
        
        // Prevent removing the last admin
        if (memberToRemove.getRole() == WorkspaceRole.ADMIN) {
            long adminCount = workspaceMemberRepository.findByWorkspaceIdAndDeletedAtIsNull(workspaceId).stream()
                    .filter(m -> m.getRole() == WorkspaceRole.ADMIN)
                    .count();
            if (adminCount <= 1) {
                throw new ConflictException(ErrorCode.BAD_REQUEST, "Cannot remove the last admin of a workspace");
            }
        }

        memberToRemove.setDeletedAt(LocalDateTime.now(clock));
        workspaceMemberRepository.save(memberToRemove);
    }

    private WorkspaceMemberResponse mapToResponse(WorkspaceMember member) {
        return WorkspaceMemberResponse.builder()
                .id(member.getId())
                .userId(member.getUser().getId())
                .email(member.getUser().getEmail())
                .firstName(member.getUser().getFirstName())
                .lastName(member.getUser().getLastName())
                .role(member.getRole())
                .status(member.getStatus().name())
                .joinedAt(member.getCreatedAt())
                .build();
    }
}
