package com.developerplatform.workspace.mapper;

import com.developerplatform.workspace.dto.response.WorkspaceMemberResponse;
import com.developerplatform.workspace.entity.WorkspaceMember;

public class WorkspaceMemberMapper {

    public static WorkspaceMemberResponse toResponse(WorkspaceMember entity) {
        if (entity == null) {
            return null;
        }

        return WorkspaceMemberResponse.builder()
                .id(entity.getId())
                .workspaceId(entity.getWorkspace().getId())
                .userId(entity.getUser().getId())
                .email(entity.getUser().getEmail())
                .firstName(entity.getUser().getFirstName())
                .lastName(entity.getUser().getLastName())
                .role(entity.getRole())
                .status(entity.getStatus())
                .joinedAt(entity.getCreatedAt())
                .build();
    }
}
