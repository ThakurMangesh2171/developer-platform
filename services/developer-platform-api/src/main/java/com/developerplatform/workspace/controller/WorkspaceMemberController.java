package com.developerplatform.workspace.controller;

import com.developerplatform.security.UserPrincipal;
import com.developerplatform.workspace.dto.InviteMemberRequest;
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

    private final WorkspaceMemberService workspaceMemberService;

    @GetMapping
    public ResponseEntity<List<WorkspaceMemberResponse>> getMembers(
            @PathVariable UUID workspaceId,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity.ok(workspaceMemberService.getMembers(workspaceId, userPrincipal.getId()));
    }

    @PostMapping
    public ResponseEntity<WorkspaceMemberResponse> inviteMember(
            @PathVariable UUID workspaceId,
            @RequestBody InviteMemberRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity.ok(workspaceMemberService.inviteMember(workspaceId, userPrincipal.getId(), request));
    }

    @PutMapping("/{memberId}/role")
    public ResponseEntity<WorkspaceMemberResponse> updateRole(
            @PathVariable UUID workspaceId,
            @PathVariable UUID memberId,
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        
        WorkspaceRole newRole = WorkspaceRole.valueOf(body.get("role").toUpperCase());
        return ResponseEntity.ok(workspaceMemberService.updateRole(workspaceId, memberId, userPrincipal.getId(), newRole));
    }

    @DeleteMapping("/{memberId}")
    public ResponseEntity<Void> removeMember(
            @PathVariable UUID workspaceId,
            @PathVariable UUID memberId,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        workspaceMemberService.removeMember(workspaceId, memberId, userPrincipal.getId());
        return ResponseEntity.noContent().build();
    }
}
