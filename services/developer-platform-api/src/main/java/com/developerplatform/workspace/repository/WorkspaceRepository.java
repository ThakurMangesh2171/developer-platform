package com.developerplatform.workspace.repository;

import com.developerplatform.workspace.entity.Workspace;
import com.developerplatform.workspace.enums.WorkspaceStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface WorkspaceRepository extends JpaRepository<Workspace, UUID> {

    List<Workspace> findByUserIdAndStatusNot(UUID userId, WorkspaceStatus status);

    Optional<Workspace> findByIdAndUserIdAndStatusNot(UUID id, UUID userId, WorkspaceStatus status);
    
    Optional<Workspace> findByIdAndStatusNot(UUID id, WorkspaceStatus status);

    boolean existsByUserIdAndNameAndStatusNot(UUID userId, String name, WorkspaceStatus status);
}
