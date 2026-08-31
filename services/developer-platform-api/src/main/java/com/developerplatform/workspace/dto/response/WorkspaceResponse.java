package com.developerplatform.workspace.dto.response;

import com.developerplatform.workspace.enums.WorkspaceStatus;
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
public class WorkspaceResponse {

    private UUID id;
    private UUID userId;
    private String name;
    private String description;
    private WorkspaceStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
