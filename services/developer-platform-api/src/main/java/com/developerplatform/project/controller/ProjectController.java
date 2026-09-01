package com.developerplatform.project.controller;

import com.developerplatform.common.constants.ApiPaths;
import com.developerplatform.common.constants.messages.ProjectMessages;
import com.developerplatform.common.response.ApiResponse;
import com.developerplatform.project.dto.request.CreateProjectRequest;
import com.developerplatform.project.dto.request.UpdateProjectRequest;
import com.developerplatform.project.dto.response.ProjectResponse;
import com.developerplatform.project.service.interfaces.ProjectService;
import com.developerplatform.security.UserPrincipal;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping(ApiPaths.PROJECTS)
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;
    private final java.time.Clock clock;

    @PostMapping
    public ResponseEntity<ApiResponse<ProjectResponse>> createProject(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody CreateProjectRequest request) {

        ProjectResponse responseData = projectService.createProject(principal.getId(), request);

        ApiResponse<ProjectResponse> response = ApiResponse.<ProjectResponse>builder()
                .success(true)
                .message(ProjectMessages.PROJECT_CREATED)
                .data(responseData)
                .timestamp(LocalDateTime.now(clock))
                .build();

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProjectResponse>> getProject(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID id) {

        ProjectResponse responseData = projectService.getProject(principal.getId(), id);

        ApiResponse<ProjectResponse> response = ApiResponse.<ProjectResponse>builder()
                .success(true)
                .message("Project retrieved successfully")
                .data(responseData)
                .timestamp(LocalDateTime.now(clock))
                .build();

        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ProjectResponse>>> getWorkspaceProjects(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam UUID workspaceId) {

        List<ProjectResponse> responseData = projectService.getWorkspaceProjects(principal.getId(), workspaceId);

        ApiResponse<List<ProjectResponse>> response = ApiResponse.<List<ProjectResponse>>builder()
                .success(true)
                .message("Projects retrieved successfully")
                .data(responseData)
                .timestamp(LocalDateTime.now(clock))
                .build();

        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ProjectResponse>> updateProject(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID id,
            @Valid @RequestBody UpdateProjectRequest request) {

        ProjectResponse responseData = projectService.updateProject(principal.getId(), id, request);

        ApiResponse<ProjectResponse> response = ApiResponse.<ProjectResponse>builder()
                .success(true)
                .message(ProjectMessages.PROJECT_UPDATED)
                .data(responseData)
                .timestamp(LocalDateTime.now(clock))
                .build();

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteProject(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID id) {

        projectService.deleteProject(principal.getId(), id);

        ApiResponse<Void> response = ApiResponse.<Void>builder()
                .success(true)
                .message(ProjectMessages.PROJECT_DELETED)
                .timestamp(LocalDateTime.now(clock))
                .build();

        return ResponseEntity.ok(response);
    }
}
