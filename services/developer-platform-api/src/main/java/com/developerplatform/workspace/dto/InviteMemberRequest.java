package com.developerplatform.workspace.dto;

import com.developerplatform.workspace.enums.WorkspaceRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InviteMemberRequest {
    private String email;
    private WorkspaceRole role;
}
