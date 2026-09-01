package com.developerplatform.workspace.dto.request;

import com.developerplatform.workspace.enums.WorkspaceRole;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateMemberRoleRequest {
    @NotNull(message = "Role is required")
    private WorkspaceRole role;
}
