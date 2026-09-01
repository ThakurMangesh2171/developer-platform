package com.developerplatform.common.constants.messages;

public final class FeatureFlagMessages {

    private FeatureFlagMessages() {
    }

    // Success
    public static final String FLAG_CREATED_SUCCESSFULLY = "Feature flag created successfully";
    public static final String FLAG_RETRIEVED_SUCCESSFULLY = "Feature flag retrieved successfully";
    public static final String FLAGS_RETRIEVED_SUCCESSFULLY = "Feature flags retrieved successfully";
    public static final String FLAG_UPDATED_SUCCESSFULLY = "Feature flag updated successfully";
    public static final String FLAG_DELETED_SUCCESSFULLY = "Feature flag deleted successfully";

    // Errors
    public static final String FLAG_NOT_FOUND = "Feature flag not found";
    public static final String FLAG_ALREADY_EXISTS = "Feature flag with this key already exists";
}
