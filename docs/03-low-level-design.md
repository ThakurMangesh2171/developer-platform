# Low Level Design (LLD)

## Table of Contents

1. Purpose
2. Design Goals
3. Design Principles
4. Module Structure
5. Package Structure
6. Layered Architecture
7. Layer Responsibilities
8. Domain Models
9. Entity Relationships
10. Design Patterns
11. DTO Design
12. Mapper Layer
13. Repository Layer
14. Service Layer
15. Controller Layer
16. Validation Strategy
17. Exception Handling
18. Security Design
19. API Request Flow
20. Transaction Management
21. Configuration
22. Logging Strategy
23. Naming Conventions
24. Coding Guidelines
25. Package Dependency Rules
26. Future Improvements

---

# 1. Purpose

This document describes the internal implementation design of the Developer Platform.

Unlike the High Level Design (HLD), which focuses on system architecture and major components, this document focuses on how each module is implemented inside the application.

The Low Level Design serves as the implementation blueprint for developers and defines:

- Module organization
- Package structure
- Layer responsibilities
- Internal communication
- Coding standards
- Validation strategy
- Exception handling
- Security implementation
- Transaction management
- Configuration approach

This document acts as the primary implementation reference during development.

---

# 2. Design Goals

The application is designed with the following goals:

- Maintain a clean and modular architecture.
- Keep business logic independent from infrastructure.
- Promote loose coupling and high cohesion.
- Improve maintainability and readability.
- Enable easy unit testing.
- Follow production-ready backend engineering practices.
- Support future migration to microservices.

---

# 3. Design Principles

The project follows the principles below.

- Single Responsibility Principle (SRP)
- Open/Closed Principle (OCP)
- Dependency Injection
- Layered Architecture
- Separation of Concerns
- Constructor Injection
- Stateless Services
- Clean Code
- Modular Design

Each module owns its business logic and communicates through service interfaces.

---

# 4. Module Structure

Version 1 consists of the following modules.

| Module | Responsibility |
|---------|----------------|
| Authentication | User registration, login and JWT authentication |
| Workspace | Workspace management |
| Project | Project management |
| API Key | API key generation and management |
| URL Shortener | URL shortening and analytics |
| Common | Shared classes and utilities |
| Security | Authentication and authorization |
| Configuration | Spring configuration |

Each module is isolated and contains its own business logic.

---

# 5. Package Structure

```text
com.developerplatform

├── authentication
│   ├── controller
│   ├── dto
│   ├── entity
│   ├── mapper
│   ├── repository
│   ├── service
│   ├── validator
│   └── exception
│
├── workspace
├── project
├── apikey
├── url
├── common
├── configuration
├── security
├── exception
├── util
│
└── DeveloperPlatformApplication
```

Every business module follows the same package structure to maintain consistency.

---

# 6. Layered Architecture

The application follows a layered architecture.

```text
Client

↓

Controller

↓

Service

↓

Repository

↓

Database
```

Each layer has a single responsibility and communicates only with adjacent layers.

---

# 7. Layer Responsibilities

| Layer | Responsibility |
|---------|---------------|
| Controller | Accept HTTP requests and return responses |
| DTO | API request and response models |
| Service | Business logic |
| Repository | Database operations |
| Entity | Database mapping |
| Mapper | Entity ↔ DTO conversion |
| Validator | Business validation |

---

# 8. Domain Models

Version 1 consists of the following domain models.

| Entity | Description |
|---------|-------------|
| User | Registered developer account |
| Workspace | Logical container for projects |
| Project | Individual application inside a workspace |
| ApiKey | Authentication credential |
| ShortUrl | URL shortening information |

Detailed field definitions are documented in the Database Design document.

---

# 9. Entity Relationships

The high-level entity relationship is shown below.

```text
User
  │
  ▼
Workspace
  │
  ▼
Project
  │
  ▼
ApiKey
  │
  ▼
ShortUrl
```

A detailed ER diagram is available in the Database Design document.

---

# 10. Design Patterns

The application follows the following design patterns.

- Layered Architecture
- Repository Pattern
- Dependency Injection
- Builder Pattern
- Factory Pattern (Future)
- Strategy Pattern (Future)

---

# 11. DTO Design

DTOs are used to isolate API contracts from database entities.

Benefits:

- Prevent entity exposure
- API versioning
- Easier validation
- Better maintainability

Examples:

- RegisterRequest
- RegisterResponse
- LoginRequest
- LoginResponse
- WorkspaceRequest
- WorkspaceResponse
- ProjectRequest
- ProjectResponse

---

# 12. Mapper Layer

The mapper layer converts entities into DTOs and vice versa.

Responsibilities:

- Entity → Response DTO
- Request DTO → Entity

MapStruct may be introduced in future versions to reduce boilerplate code.

---

# 13. Repository Layer

Repositories are responsible only for database interactions.

Responsibilities:

- CRUD operations
- Pagination
- Sorting
- Custom JPQL queries
- Native SQL queries when required

Repositories must never contain business logic.

---

# 14. Service Layer

Services implement business rules.

Responsibilities:

- Business validation
- Transactions
- Calling repositories
- Module coordination
- Event publishing (Future)

---

# 15. Controller Layer

Controllers expose REST APIs.

Responsibilities:

- Request validation
- Invoking services
- Returning standardized responses

Controllers must remain lightweight and should never contain business logic.

---

# 16. Validation Strategy

Validation is performed at two levels.

### Request Validation

Bean Validation annotations.

- @NotBlank
- @Email
- @Size
- @Pattern

### Business Validation

Performed inside the Service layer.

Examples:

- Workspace name uniqueness
- API key ownership
- URL expiration validation

---

# 17. Exception Handling

The application uses centralized exception handling.

A global exception handler returns standardized error responses.

```json
{
  "timestamp": "",
  "status": 400,
  "error": "Bad Request",
  "message": "",
  "path": ""
}
```

Custom exceptions include:

- ResourceNotFoundException
- ValidationException
- UnauthorizedException
- ForbiddenException
- ConflictException

---

# 18. Security Design

Authentication is implemented using JWT.

Authorization follows Role-Based Access Control (RBAC).

Future enhancements:

- Workspace roles
- API Key authentication
- Rate limiting

---

# 19. API Request Flow

```text
Client

↓

Controller

↓

Validation

↓

Service

↓

Repository

↓

PostgreSQL

↓

Mapper

↓

Response DTO

↓

Client
```

---

# 20. Transaction Management

Transactions are managed at the Service layer.

Guidelines:

- One transaction per business operation
- Read-only transactions where applicable
- Avoid nested transactions
- Use @Transactional

---

# 21. Configuration

Configuration classes:

- SecurityConfig
- JwtConfig
- SwaggerConfig
- RedisConfig
- DatabaseConfig

Application profiles:

- application.yml
- application-dev.yml
- application-prod.yml

---

# 22. Logging Strategy

Logging is implemented using SLF4J.

| Level | Usage |
|--------|-------|
| INFO | Business operations |
| DEBUG | Development troubleshooting |
| WARN | Recoverable issues |
| ERROR | Unexpected failures |

Sensitive data such as passwords, JWT tokens and API keys must never be logged.

---

# 23. Naming Conventions

Classes

- UserService
- UserRepository
- UserController

DTOs

- RegisterRequest
- RegisterResponse

Methods

- createUser()
- createWorkspace()
- generateApiKey()

---

# 24. Coding Guidelines

- Constructor Injection only
- No field injection
- No business logic inside controllers
- No business logic inside repositories
- Follow REST API conventions
- Keep methods small and focused

---

# 25. Package Dependency Rules

Application dependency flow:

```text
Controller

↓

Service

↓

Repository

↓

Database
```

Rules:

- Controllers cannot access repositories directly.
- Repositories cannot call services.
- Services coordinate all business operations.

---

# 26. Future Improvements

Version 2

- Event Publishing
- Kafka
- Async Processing

Version 3

- Object Storage

Version 4

- AI Services

Version 5

- Event-Driven Architecture
- Microservices