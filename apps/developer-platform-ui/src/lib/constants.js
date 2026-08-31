// Centralized API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/v1/auth/login',
    REGISTER: '/api/v1/auth/register',
    VERIFY_EMAIL: '/api/v1/auth/verify-email',
    ME: '/api/v1/auth/me',
    UPDATE_PROFILE: '/api/v1/auth/me',
    CHANGE_PASSWORD: '/api/v1/auth/password',
  },
  WORKSPACE: {
    BASE: '/api/v1/workspaces',
    STATS: (id) => `/api/v1/workspaces/${id}/stats`,
    MEMBERS: (id) => `/api/v1/workspaces/${id}/members`,
  },
  PROJECT: {
    BASE: '/api/v1/projects',
  },
  URL_SHORTENER: {
    BASE: '/api/v1/urls',
  },
  FEATURE_FLAGS: {
    BASE: '/api/v1/feature-flags'
  },
  API_KEYS: {
    BASE: '/api/v1/api-keys',
  },
  WEBHOOKS: {
    BASE: (projectId) => `/api/v1/projects/${projectId}/webhooks`,
  }
};
