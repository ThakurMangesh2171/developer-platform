package com.developerplatform.workspace.dto.response;

import com.developerplatform.workspace.enums.WorkspaceRole;
import com.developerplatform.workspace.enums.WorkspaceMemberStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WorkspaceMemberResponse {
    private UUID id;
    private UUID workspaceId;
    private UUID userId;
    private String email;
    private String firstName;
    private String lastName;
    private WorkspaceRole role;
    private WorkspaceMemberStatus status;
    private LocalDateTime joinedAt;
}
