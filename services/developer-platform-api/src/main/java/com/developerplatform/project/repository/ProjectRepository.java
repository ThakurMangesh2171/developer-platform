package com.developerplatform.project.repository;

import com.developerplatform.project.entity.Project;
import com.developerplatform.project.enums.ProjectStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProjectRepository extends JpaRepository<Project, UUID> {

    List<Project> findByWorkspaceIdAndStatusNot(UUID workspaceId, ProjectStatus status);

    Optional<Project> findByIdAndStatusNot(UUID id, ProjectStatus status);

    boolean existsByWorkspaceIdAndNameAndStatusNot(UUID workspaceId, String name, ProjectStatus status);
}
