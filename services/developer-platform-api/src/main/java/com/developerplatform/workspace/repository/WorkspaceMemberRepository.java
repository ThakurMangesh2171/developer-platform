package com.developerplatform.workspace.repository;

import com.developerplatform.workspace.entity.WorkspaceMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface WorkspaceMemberRepository extends JpaRepository<WorkspaceMember, UUID> {
    
    List<WorkspaceMember> findByWorkspaceIdAndDeletedAtIsNull(UUID workspaceId);
    
    List<WorkspaceMember> findByUserIdAndDeletedAtIsNull(UUID userId);
    
    Optional<WorkspaceMember> findByWorkspaceIdAndUserIdAndDeletedAtIsNull(UUID workspaceId, UUID userId);
    
    boolean existsByWorkspaceIdAndUserIdAndDeletedAtIsNull(UUID workspaceId, UUID userId);
}
