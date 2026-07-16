package com.developerplatform.common.constants;

public final class ApiPaths {

    private ApiPaths() {
    }

    public static final String API_V1 = "/api/v1";

    /*
     * Authentication
     */
    public static final String AUTH = API_V1 + "/auth";

    /*
     * Users
     */
    public static final String USERS = API_V1 + "/users";

    /*
     * Workspaces
     */
    public static final String WORKSPACES = API_V1 + "/workspaces";

    /*
     * Projects
     */
    public static final String PROJECTS = API_V1 + "/projects";

    /*
     * API Keys
     */
    public static final String API_KEYS = API_V1 + "/api-keys";

}