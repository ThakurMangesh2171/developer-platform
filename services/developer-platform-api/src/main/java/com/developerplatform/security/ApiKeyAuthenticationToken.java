package com.developerplatform.security;

import org.springframework.security.authentication.AbstractAuthenticationToken;

import java.util.Collections;
import java.util.UUID;

public class ApiKeyAuthenticationToken extends AbstractAuthenticationToken {

    private final UUID projectId;
    private final String apiKeyPrefix;

    public ApiKeyAuthenticationToken(UUID projectId, String apiKeyPrefix) {
        super(Collections.emptyList());
        this.projectId = projectId;
        this.apiKeyPrefix = apiKeyPrefix;
        setAuthenticated(true);
    }

    @Override
    public Object getCredentials() {
        return apiKeyPrefix;
    }

    @Override
    public Object getPrincipal() {
        return projectId;
    }

    public UUID getProjectId() {
        return (UUID) getPrincipal();
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof ApiKeyAuthenticationToken that)) return false;
        if (!super.equals(o)) return false;
        return java.util.Objects.equals(projectId, that.projectId) &&
               java.util.Objects.equals(apiKeyPrefix, that.apiKeyPrefix);
    }

    @Override
    public int hashCode() {
        return java.util.Objects.hash(super.hashCode(), projectId, apiKeyPrefix);
    }
}
