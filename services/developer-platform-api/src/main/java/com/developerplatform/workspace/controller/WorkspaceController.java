package com.developerplatform.workspace.controller;

import com.developerplatform.common.constants.ApiPaths;
import com.developerplatform.common.constants.messages.WorkspaceMessages;
import com.developerplatform.common.response.ApiResponse;
import com.developerplatform.security.UserPrincipal;
import com.developerplatform.workspace.dto.request.CreateWorkspaceRequest;
import com.developerplatform.workspace.dto.request.UpdateWorkspaceRequest;
import com.developerplatform.workspace.dto.response.WorkspaceResponse;
import com.developerplatform.workspace.service.interfaces.WorkspaceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping(ApiPaths.WORKSPACES)
@RequiredArgsConstructor
public class WorkspaceController {

    private final WorkspaceService workspaceService;

    @PostMapping
    public ResponseEntity<ApiResponse<WorkspaceResponse>> createWorkspace(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody CreateWorkspaceRequest request) {

        WorkspaceResponse responseData = workspaceService.createWorkspace(principal.getId(), request);

        ApiResponse<WorkspaceResponse> response = ApiResponse.<WorkspaceResponse>builder()
                .success(true)
                .message(WorkspaceMessages.WORKSPACE_CREATED)
                .data(responseData)
                .timestamp(LocalDateTime.now())
                .build();

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<WorkspaceResponse>> getWorkspace(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID id) {

        WorkspaceResponse responseData = workspaceService.getWorkspace(principal.getId(), id);

        ApiResponse<WorkspaceResponse> response = ApiResponse.<WorkspaceResponse>builder()
                .success(true)
                .message("Workspace retrieved successfully")
                .data(responseData)
                .timestamp(LocalDateTime.now())
                .build();

        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<WorkspaceResponse>>> getUserWorkspaces(
            @AuthenticationPrincipal UserPrincipal principal) {

        List<WorkspaceResponse> responseData = workspaceService.getUserWorkspaces(principal.getId());

        ApiResponse<List<WorkspaceResponse>> response = ApiResponse.<List<WorkspaceResponse>>builder()
                .success(true)
                .message("Workspaces retrieved successfully")
                .data(responseData)
                .timestamp(LocalDateTime.now())
                .build();

        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<WorkspaceResponse>> updateWorkspace(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID id,
            @Valid @RequestBody UpdateWorkspaceRequest request) {

        WorkspaceResponse responseData = workspaceService.updateWorkspace(principal.getId(), id, request);

        ApiResponse<WorkspaceResponse> response = ApiResponse.<WorkspaceResponse>builder()
                .success(true)
                .message(WorkspaceMessages.WORKSPACE_UPDATED)
                .data(responseData)
                .timestamp(LocalDateTime.now())
                .build();

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteWorkspace(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID id) {

        workspaceService.deleteWorkspace(principal.getId(), id);

        ApiResponse<Void> response = ApiResponse.<Void>builder()
                .success(true)
                .message(WorkspaceMessages.WORKSPACE_DELETED)
                .timestamp(LocalDateTime.now())
                .build();

        return ResponseEntity.ok(response);
    }
}
