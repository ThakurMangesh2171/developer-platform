package com.developerplatform.workspace.controller;

import com.developerplatform.security.UserPrincipal;
import com.developerplatform.workspace.dto.InviteMemberRequest;
import com.developerplatform.common.response.ApiResponse;
import com.developerplatform.workspace.dto.WorkspaceMemberResponse;
import com.developerplatform.workspace.enums.WorkspaceRole;
import com.developerplatform.workspace.service.WorkspaceMemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/workspaces/{workspaceId}/members")
@RequiredArgsConstructor
public class WorkspaceMemberController {

    private final java.time.Clock clock;
    private final WorkspaceMemberService workspaceMemberService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<WorkspaceMemberResponse>>> getMembers(
            @PathVariable UUID workspaceId,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
            
        List<WorkspaceMemberResponse> data = workspaceMemberService.getMembers(workspaceId, userPrincipal.getId());
        
        ApiResponse<List<WorkspaceMemberResponse>> response = ApiResponse.<List<WorkspaceMemberResponse>>builder()
                .success(true)
                .message("Members retrieved successfully")
                .data(data)
                .timestamp(java.time.LocalDateTime.now(clock))
                .build();
                
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<ApiResponse<WorkspaceMemberResponse>> inviteMember(
            @PathVariable UUID workspaceId,
            @RequestBody InviteMemberRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
            
        WorkspaceMemberResponse data = workspaceMemberService.inviteMember(workspaceId, userPrincipal.getId(), request);
        
        ApiResponse<WorkspaceMemberResponse> response = ApiResponse.<WorkspaceMemberResponse>builder()
                .success(true)
                .message("Member invited successfully")
                .data(data)
                .timestamp(java.time.LocalDateTime.now(clock))
                .build();
                
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{memberId}/role")
    public ResponseEntity<ApiResponse<WorkspaceMemberResponse>> updateRole(
            @PathVariable UUID workspaceId,
            @PathVariable UUID memberId,
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        
        WorkspaceRole newRole = WorkspaceRole.valueOf(body.get("role").toUpperCase());
        WorkspaceMemberResponse data = workspaceMemberService.updateRole(workspaceId, memberId, userPrincipal.getId(), newRole);
        
        ApiResponse<WorkspaceMemberResponse> response = ApiResponse.<WorkspaceMemberResponse>builder()
                .success(true)
                .message("Role updated successfully")
                .data(data)
                .timestamp(java.time.LocalDateTime.now(clock))
                .build();
                
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{memberId}")
    public ResponseEntity<ApiResponse<Void>> removeMember(
            @PathVariable UUID workspaceId,
            @PathVariable UUID memberId,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
            
        workspaceMemberService.removeMember(workspaceId, memberId, userPrincipal.getId());
        
        ApiResponse<Void> response = ApiResponse.<Void>builder()
                .success(true)
                .message("Member removed successfully")
                .timestamp(java.time.LocalDateTime.now(clock))
                .build();
                
        return ResponseEntity.ok(response);
    }
}
