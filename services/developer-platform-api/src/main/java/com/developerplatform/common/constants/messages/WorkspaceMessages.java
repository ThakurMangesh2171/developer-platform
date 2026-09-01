package com.developerplatform.common.constants.messages;

public final class WorkspaceMessages {

    private WorkspaceMessages() {
    }

    // Errors
    public static final String WORKSPACE_ALREADY_EXISTS = "Workspace with this name already exists";
    public static final String WORKSPACE_NOT_FOUND = "Workspace not found";
    public static final String MEMBER_NOT_FOUND = "Member not found in this workspace";
    public static final String CANNOT_REMOVE_LAST_ADMIN = "Cannot remove the last admin of a workspace";

    // Success
    public static final String WORKSPACE_CREATED = "Workspace created successfully";
    public static final String WORKSPACE_UPDATED = "Workspace updated successfully";
    public static final String WORKSPACE_DELETED = "Workspace deleted successfully";
}
