# Coding Standards

## Table of Contents

1. Purpose
2. General Principles
3. Project Structure
4. Package Structure
5. Naming Conventions
6. Layer Responsibilities
7. DTO Guidelines
8. Entity Guidelines
9. Exception Handling
10. Validation
11. Logging
12. Transactions
13. Configuration Management
14. Security Guidelines
15. Testing Guidelines
16. Git Workflow
17. Code Review Checklist

---

# 1. Purpose

This document defines the coding standards and best practices for the Developer Platform project.

The objective is to maintain:

- Consistent code style
- High readability
- Maintainability
- Scalability
- Production-ready software quality

Every contributor should follow these standards.

---

# 2. General Principles

The project follows the following engineering principles.

- SOLID Principles
- DRY (Don't Repeat Yourself)
- KISS (Keep It Simple)
- YAGNI (You Aren't Gonna Need It)
- Clean Code
- Separation of Concerns
- Prefer Composition over Inheritance

---

# 3. Project Structure

The project follows a Modular Monolith architecture.

```
com.developerplatform

├── authentication
├── workspace
├── project
├── apikey
├── url
├── common
├── configuration
├── security
├── exception
├── util
└── DeveloperPlatformApplication
```

Every business module owns its implementation.

---

# 4. Package Structure

Each module follows the same structure.

```
authentication

├── controller
├── service
├── repository
├── entity
├── dto
├── mapper
├── validator
└── exception
```

No module should directly access another module's repository.

Modules communicate through service interfaces.

---

# 5. Naming Conventions

## Classes

PascalCase

Examples

- UserService
- AuthenticationController
- JwtProvider

---

## Methods

camelCase

Examples

- createWorkspace()
- generateApiKey()

---

## Variables

camelCase

Examples

- workspaceId
- createdAt

---

## Constants

UPPER_SNAKE_CASE

Examples

- ACCESS_TOKEN_EXPIRY
- MAX_API_KEYS

---

## Packages

Lowercase

Examples

- authentication
- workspace
- configuration

---

# 6. Layer Responsibilities

## Controller

Responsibilities

- Accept HTTP requests
- Validate input
- Call service layer
- Return standardized responses

Controllers must never contain business logic.

---

## Service

Responsibilities

- Business logic
- Transaction management
- Validation
- Repository coordination

Services should remain focused on one business capability.

---

## Repository

Responsibilities

- Database access only

Repositories must not contain business logic.

---

## Entity

Responsibilities

- Database mapping

Entities must not be exposed directly through REST APIs.

---

## DTO

Responsibilities

- Request models
- Response models

DTOs are immutable whenever possible.

---

# 7. DTO Guidelines

- Separate Request and Response DTOs.
- Never expose entities directly.
- Use Bean Validation annotations.
- Keep DTOs lightweight.

Example

```
RegisterRequest

RegisterResponse
```

---

# 8. Entity Guidelines

- One entity per table.
- UUID as the primary key.
- Audit fields in every business entity.
- Use enums for status fields.
- Avoid business logic inside entities.

---

# 9. Exception Handling

The application uses centralized exception handling.

GlobalExceptionHandler

Responsibilities

- Convert exceptions into standard API responses.
- Hide internal implementation details.
- Log unexpected failures.

---

# 10. Validation

Validation occurs at two levels.

## Request Validation

Bean Validation

Examples

- @NotBlank
- @Email
- @Size
- @Pattern

---

## Business Validation

Performed inside the Service layer.

Examples

- Email uniqueness
- Workspace ownership
- Project name uniqueness

---

# 11. Logging

Logging uses SLF4J.

Log Levels

- INFO
- WARN
- ERROR
- DEBUG

Sensitive information must never be logged.

Examples

- Passwords
- JWT Tokens
- API Keys

---

# 12. Transactions

Transaction management is handled in the Service layer.

Guidelines

- One transaction per business operation.
- Read-only where applicable.
- Avoid nested transactions.

Use Spring's @Transactional annotation.

---

# 13. Configuration Management

Configuration is externalized.

Files

```
application.yml

application-dev.yml

application-prod.yml
```

Secrets must never be committed to Git.

Use environment variables for production credentials.

---

# 14. Security Guidelines

- Passwords stored using BCrypt.
- API Keys stored as SHA-256 hashes.
- JWT for authentication.
- Validate all user input.
- Never trust client-side validation.
- Enable HTTPS in production.

---

# 15. Testing Guidelines

Testing Frameworks

- JUnit 5
- Mockito

Guidelines

- Unit tests for business logic.
- Integration tests for REST APIs.
- Mock external dependencies.
- Maintain meaningful test coverage.

---

# 16. Git Workflow

Branch Strategy

```
feature/*
        ↓
develop
        ↓
main
```

Commit Message Convention

```
feat:
fix:
refactor:
docs:
test:
chore:
```

Example

```
feat(auth): implement JWT authentication

docs: update database design

fix(url): resolve duplicate short code issue
```

---

# 17. Code Review Checklist

Before merging any Pull Request, verify the following:

- Code follows naming conventions.
- No business logic inside controllers.
- Validation is implemented.
- Exceptions are handled properly.
- Logging is meaningful.
- No sensitive information is exposed.
- Unit tests added where applicable.
- Documentation updated if required.

---

# Conclusion

These coding standards establish a consistent engineering approach across the Developer Platform.

Following these guidelines ensures that the codebase remains maintainable, scalable, secure, and production-ready as the platform evolves.