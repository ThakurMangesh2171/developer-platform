# API Design

## Table of Contents

1. Purpose
2. API Standards
3. Authentication Strategy
4. API Versioning
5. Standard Request & Response Format
6. HTTP Status Codes
7. Authentication APIs
8. Workspace APIs
9. Project APIs
10. API Key APIs
11. URL Shortener APIs
12. Common Validation Rules
13. Security Considerations
14. Future APIs

---

# 1. Purpose

This document defines the REST API contracts for Developer Platform Version 1.

It acts as the implementation reference for backend development and establishes a consistent contract between frontend applications and backend services.

The platform follows RESTful principles and uses JSON as the standard data exchange format.

Version 1 includes APIs for:

- Authentication
- Workspace Management
- Project Management
- API Key Management
- URL Shortener

---

# 2. API Standards

## Base URL

```
/api/v1
```

## Content Type

```
application/json
```

## Authentication Header

Protected endpoints require a JWT access token.

```
Authorization: Bearer <access_token>
```

## Naming Convention

- Resource names use plural nouns.
- URLs use lowercase.
- Hyphen-separated resource names.
- JSON fields use camelCase.
- HTTP methods follow REST conventions.

---

# 3. Authentication Strategy

The platform uses JWT-based authentication.

### Public APIs

- Register
- Login
- Refresh Token

### Protected APIs

- Workspace
- Project
- API Keys
- URL Shortener

---

# 4. API Versioning

The platform follows URL-based versioning.

Example:

```
/api/v1/auth/login
```

Future versions:

```
/api/v2/...
```

---

# 5. Standard Request & Response Format

## Success Response

```json
{
  "success": true,
  "message": "Workspace created successfully",
  "data": {},
  "timestamp": "2026-07-12T12:00:00Z"
}
```

## Error Response

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Email already exists"
    }
  ],
  "timestamp": "2026-07-12T12:00:00Z"
}
```

---

# 6. HTTP Status Codes

| Status | Meaning |
|---------|---------|
|200|OK|
|201|Created|
|204|No Content|
|400|Bad Request|
|401|Unauthorized|
|403|Forbidden|
|404|Not Found|
|409|Conflict|
|422|Validation Failed|
|500|Internal Server Error|

---

# 7. Authentication APIs

## Register User

### Endpoint

```
POST /api/v1/auth/register
```

### Authentication Required

No

### Request

```json
{
  "name": "Mangesh",
  "email": "mangesh@gmail.com",
  "password": "Password@123"
}
```

### Success Response

```json
{
  "id": "uuid",
  "email": "mangesh@gmail.com"
}
```

### Status Code

```
201 Created
```

### Validation Rules

- Email must be unique.
- Password must contain at least 8 characters.
- Password must include uppercase, lowercase, number, and special character.

---

## Login

### Endpoint

```
POST /api/v1/auth/login
```

### Authentication Required

No

### Request

```json
{
  "email": "mangesh@gmail.com",
  "password": "Password@123"
}
```

### Success Response

```json
{
  "accessToken": "...",
  "refreshToken": "...",
  "expiresIn": 3600
}
```

### Status Code

```
200 OK
```

---

## Refresh Token

```
POST /api/v1/auth/refresh
```

---

## Logout

```
POST /api/v1/auth/logout
```

---

# 8. Workspace APIs

| Method | Endpoint | Description |
|---------|----------|-------------|
|POST|/api/v1/workspaces|Create Workspace|
|GET|/api/v1/workspaces|List Workspaces|
|GET|/api/v1/workspaces/{id}|Get Workspace|
|PUT|/api/v1/workspaces/{id}|Update Workspace|
|DELETE|/api/v1/workspaces/{id}|Delete Workspace|

---

# 9. Project APIs

| Method | Endpoint | Description |
|---------|----------|-------------|
|POST|/api/v1/projects|Create Project|
|GET|/api/v1/projects|List Projects|
|GET|/api/v1/projects/{id}|Get Project|
|PUT|/api/v1/projects/{id}|Update Project|
|DELETE|/api/v1/projects/{id}|Delete Project|

---

# 10. API Key APIs

| Method | Endpoint | Description |
|---------|----------|-------------|
|POST|/api/v1/projects/{projectId}/api-keys|Generate API Key|
|GET|/api/v1/projects/{projectId}/api-keys|List API Keys|
|PUT|/api/v1/api-keys/{id}/rotate|Rotate API Key|
|DELETE|/api/v1/api-keys/{id}|Revoke API Key|

---

# 11. URL Shortener APIs

| Method | Endpoint | Description |
|---------|----------|-------------|
|POST|/api/v1/urls|Create Short URL|
|GET|/api/v1/urls|List URLs|
|GET|/{shortCode}|Redirect|
|GET|/api/v1/urls/{id}/analytics|URL Analytics|
|DELETE|/api/v1/urls/{id}|Delete URL|

---

# 12. Common Validation Rules

- Email must follow RFC-compliant format.
- Password must satisfy complexity requirements.
- Workspace names must be unique per user.
- Project names must be unique within a workspace.
- Short URLs must be valid HTTP/HTTPS URLs.
- Custom aliases may contain only letters, numbers, and hyphens.

---

# 13. Security Considerations

- JWT-based authentication
- HTTPS-only communication
- Password hashing using BCrypt
- API key hashing before storage
- Request validation
- CORS configuration
- Rate limiting (planned)
- Audit logging (planned)

---

# 14. Future APIs

Future versions of the platform will introduce APIs for:

- Notifications
- File Storage
- Analytics
- AI Services
- Organization Management
- Billing