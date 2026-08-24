// Centralized API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/v1/auth/login',
    REGISTER: '/api/v1/auth/register',
    VERIFY_EMAIL: '/api/v1/auth/verify-email',
  },
  WORKSPACE: {
    BASE: '/api/v1/workspaces',
  },
  PROJECT: {
    BASE: '/api/v1/projects',
  },
  URL_SHORTENER: {
    BASE: '/api/v1/urls',
  },
  API_KEYS: {
    BASE: '/api/v1/api-keys',
  }
};
