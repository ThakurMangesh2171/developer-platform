# High Level Design (HLD)

## 1. System Overview

Developer Platform is a centralized backend platform that provides reusable backend services for application developers.

The platform enables developers to:

- Create and manage user accounts
- Create workspaces
- Create projects
- Generate and manage API keys
- Consume platform services through REST APIs

The first platform service available in **Version 1** is a URL Shortener.

The platform follows a **Modular Monolith** architecture to simplify development while maintaining clear module boundaries, enabling future migration to Microservices as the platform grows.

---

# 2. Architecture Style

The application follows a **Modular Monolith** architecture.

Each business capability is implemented as an independent module containing its own:

- Controllers
- Services
- Repositories
- Domain Models

Modules communicate through well-defined service interfaces rather than directly accessing each other's implementation.

## Why Modular Monolith?

- Faster development
- Easier debugging
- Clear separation of concerns
- Easier testing
- Simple deployment
- Lower operational overhead
- Supports future migration to Microservices

---

# 3. High Level Architecture

```text
                    +----------------------+
                    |      Internet        |
                    +----------+-----------+
                               |
                               v
                    +----------------------+
                    |   Spring Boot API    |
                    +----------+-----------+
                               |
      +------------+-----------+-----------+-----------+------------+
      |            |           |           |           |
      v            v           v           v           v
+-----------+ +-----------+ +-----------+ +-----------+ +-----------+
| Auth      | | Workspace | | Project   | | API Key   | | URL       |
| Module    | | Module    | | Module    | | Module    | | Module    |
+-----------+ +-----------+ +-----------+ +-----------+ +-----------+
                               |
                               v
                    +----------------------+
                    |    PostgreSQL DB     |
                    +----------+-----------+
                               |
                               v
                    +----------------------+
                    |        Redis         |
                    +----------------------+
```

---

# 4. Core Modules

## Authentication Module

Responsible for:

- User Registration
- Login
- JWT Authentication
- Refresh Token Management
- Password Encryption

---

## Workspace Module

Responsible for:

- Create Workspace
- Update Workspace
- Delete Workspace

---

## Project Module

Responsible for:

- Create Project
- Update Project
- Delete Project

---

## API Key Module

Responsible for:

- Generate API Keys
- Rotate API Keys
- Revoke API Keys

---

## URL Shortener Module

Responsible for:

- Create Short URL
- Redirect Requests
- URL Analytics
- URL Expiration
- Custom Alias

---

# 5. Request Flow

Every client request follows the architecture below.

```text
Client

↓

Spring Security

↓

JWT Authentication

↓

Business Module
(Authentication / Workspace / Project / API Key / URL)

↓

PostgreSQL

↓

Response
```

---

# 6. Database

The platform uses **PostgreSQL** as the primary relational database.

## Why PostgreSQL?

- ACID-compliant transactions
- Excellent indexing support
- JSONB support for semi-structured data
- Mature ecosystem
- Open-source
- Production proven
- Excellent Spring Boot integration

### Alternatives Considered

- MySQL
- MongoDB

### Why Not MongoDB?

The platform manages highly relational entities such as Users, Workspaces, Projects, API Keys, and URLs. PostgreSQL provides stronger transactional consistency and better relational modeling for this use case.

---

# 7. Authentication Strategy

The platform uses **JWT-based authentication**.

## Why JWT?

- Stateless authentication
- Supports horizontal scaling
- REST API friendly
- Mobile friendly
- No server-side session storage
- Easy integration with API Gateways

### Alternatives Considered

- Session-based Authentication

---

# 8. Caching Strategy

Redis is used as the primary caching layer.

## Current Usage

- URL Cache
- API Key Cache

## Future Usage

- Rate Limiting
- Session Store
- Distributed Locks
- Frequently Accessed Metadata

### Why Redis?

- Sub-millisecond latency
- In-memory storage
- Rich data structures
- Production proven
- Easy Spring Boot integration

---

# 9. Deployment Architecture

The initial deployment architecture is intentionally simple.

```text
Developer

↓

GitHub

↓

Docker

↓

Spring Boot Application

↓

PostgreSQL

↓

Redis
```

Future deployments may include:

- Nginx
- Kubernetes
- CI/CD Pipeline
- Cloud Infrastructure

---

# 10. Technology Stack

| Layer | Technology |
|-------|------------|
| Programming Language | Java 21 |
| Framework | Spring Boot 3 |
| Security | Spring Security + JWT |
| ORM | Spring Data JPA / Hibernate |
| Database | PostgreSQL |
| Cache | Redis |
| Build Tool | Maven |
| Database Migration | Flyway |
| API Documentation | Swagger (OpenAPI 3) |
| Testing | JUnit 5 + Mockito |
| Containerization | Docker |

---
# 11. Technology Decisions

## Java 21

### Problem

The platform requires a stable, enterprise-grade programming language that offers long-term support, modern language features, and excellent compatibility with the Spring ecosystem.

### Alternatives Considered

- Java 17
- Java 24

### Why Not Others?

**Java 17**
- Stable and widely adopted.
- Older LTS release with fewer language improvements than Java 21.

**Java 24**
- Provides the latest language features.
- Not an LTS release, requiring more frequent upgrades.

### Final Decision

Java 21 was selected because it is the latest Long-Term Support (LTS) release, providing modern language features, long-term stability, continuous security updates, and strong enterprise adoption.

### Trade-offs

**Pros**

- Long-term support
- Modern language features
- Strong Spring Boot compatibility
- Enterprise adoption

**Cons**

- Slightly newer ecosystem compared to Java 17

---

## Spring Boot

### Problem

The platform requires a mature framework for building scalable, production-ready REST APIs with minimal configuration.

### Alternatives Considered

- Quarkus
- Micronaut

### Why Not Others?

**Quarkus**

- Excellent startup performance
- Better suited for cloud-native environments
- Smaller ecosystem compared to Spring

**Micronaut**

- Lightweight framework
- Fast startup
- Smaller community and fewer enterprise integrations

### Final Decision

Spring Boot was selected because it provides a mature ecosystem, extensive enterprise adoption, excellent documentation, and seamless integration with Spring Security, Spring Data JPA, Flyway, and other supporting libraries.

### Trade-offs

**Pros**

- Rapid development
- Rich ecosystem
- Excellent documentation
- Large community
- Production-ready tooling

**Cons**

- Higher memory usage than Quarkus or Micronaut

---

## Maven

### Problem

The project requires a build tool capable of dependency management, packaging, testing, and integration with the Spring ecosystem.

### Alternatives Considered

- Gradle

### Why Not Others?

**Gradle**

- Faster incremental builds
- Flexible build scripting

However, Maven provides a more standardized project structure and is widely adopted across enterprise Spring Boot projects.

### Final Decision

Maven was selected because it offers mature dependency management, strong Spring Boot integration, an extensive plugin ecosystem, and excellent support for enterprise development.

### Trade-offs

**Pros**

- Stable
- Predictable project structure
- Large plugin ecosystem
- Excellent Spring Boot support

**Cons**

- Slower builds compared to Gradle

---

## PostgreSQL

### Problem

The platform requires a reliable relational database capable of handling transactional workloads while supporting future scalability.

### Alternatives Considered

- MySQL
- MongoDB

### Why Not Others?

**MySQL**

- Mature relational database
- Good performance

However, PostgreSQL provides richer indexing options, JSONB support, and advanced SQL capabilities.

**MongoDB**

- Flexible schema
- Suitable for document-oriented data

However, the Developer Platform primarily manages highly relational entities such as Users, Workspaces, Projects, API Keys, and URLs, making a relational database a better fit.

### Final Decision

PostgreSQL was selected because it provides ACID-compliant transactions, advanced indexing, JSONB support, excellent performance, and strong enterprise adoption.

### Trade-offs

**Pros**

- ACID compliance
- Excellent indexing
- JSONB support
- Production proven

**Cons**

- Slightly steeper learning curve than MySQL

---

## Redis

### Problem

The platform requires a high-performance caching layer to reduce database load and improve response times.

### Alternatives Considered

- In-memory application cache
- Hazelcast

### Why Not Others?

**Application Cache**

- Works only within a single application instance.
- Does not support distributed deployments.

**Hazelcast**

- Distributed caching platform.
- More operational complexity than required for Version 1.

### Final Decision

Redis was selected because it provides extremely fast in-memory storage, supports distributed deployments, and offers additional capabilities such as rate limiting, distributed locks, and session storage.

### Trade-offs

**Pros**

- Extremely fast
- Rich data structures
- Distributed cache
- Production proven

**Cons**

- Additional infrastructure to maintain

---

## JWT Authentication

### Problem

The platform requires a secure authentication mechanism suitable for REST APIs and horizontal scaling.

### Alternatives Considered

- Session-based Authentication
- OAuth2

### Why Not Others?

**Session-Based Authentication**

- Requires server-side session storage.
- Makes horizontal scaling more difficult.

**OAuth2**

- Better suited for third-party authentication providers.
- Introduces unnecessary complexity for Version 1.

### Final Decision

JWT was selected because it enables stateless authentication, simplifies scaling, and integrates naturally with REST APIs.

### Trade-offs

**Pros**

- Stateless
- Scalable
- Mobile friendly
- REST friendly

**Cons**

- Token revocation requires additional handling

---

## Flyway

### Problem

The application requires version-controlled database schema management across development, testing, and production environments.

### Alternatives Considered

- Liquibase

### Why Not Others?

**Liquibase**

- More flexible
- XML/YAML/SQL support

However, Flyway offers a simpler migration workflow and integrates seamlessly with Spring Boot.

### Final Decision

Flyway was selected because of its simplicity, SQL-first approach, and widespread adoption within Spring Boot applications.

### Trade-offs

**Pros**

- Simple
- Reliable
- Easy rollback strategy
- Spring Boot integration

**Cons**

- Less flexible than Liquibase for complex migration scenarios

---

## Docker

### Problem

The platform requires a consistent execution environment across development, testing, and deployment.

### Alternatives Considered

- Native Host Deployment
- Virtual Machines

### Why Not Others?

**Native Deployment**

- Environment inconsistencies between machines.

**Virtual Machines**

- Higher resource consumption.
- Slower startup times.

### Final Decision

Docker was selected because it provides reproducible deployments, environment isolation, and simplifies local development and CI/CD pipelines.

### Trade-offs

**Pros**

- Consistent environments
- Easy deployment
- Lightweight
- Excellent CI/CD support

**Cons**

- Additional learning curve for beginners
---

# 12. Security Considerations

Version 1 includes:

- BCrypt Password Hashing
- JWT Authentication
- HTTPS Support
- Role-Based Authorization
- API Key Hashing
- Input Validation
- SQL Injection Protection
- CORS Configuration

---

# 13. Design Decisions

| Decision | Reason |
|----------|--------|
| Modular Monolith | Faster development and simpler deployment |
| PostgreSQL | Strong relational database with JSONB support |
| JWT Authentication | Stateless authentication |
| Redis | High-performance caching |
| Flyway | Database version control |
| Docker | Consistent deployment across environments |

---

# 14. Assumptions

- Single-region deployment
- Single PostgreSQL instance
- Single Redis instance
- REST APIs only
- JWT Authentication
- Docker-based deployment

---

# 15. Constraints

Version 1 intentionally excludes:

- Microservices
- Kubernetes
- Event-Driven Architecture
- Multi-region Deployment
- GraphQL
- gRPC

These constraints reduce implementation complexity while allowing rapid product development.

---

# 16. Future Evolution

```text
Version 1
│
├── Modular Monolith
│
▼

Version 1.1
│
├── Notifications
├── Analytics Dashboard
├── Custom Domains
│
▼

Version 2
│
├── Object Storage
├── File Storage
├── CDN Integration
│
▼

Version 3
│
├── AI Services
├── Document Search
├── Embedding Services
│
▼

Version 4
│
├── Developer Marketplace
├── Billing
├── Organization Management
│
▼

Version 5
│
├── Event-Driven Architecture
├── Kafka
└── Independent Microservices
```

---

# 17. Known Limitations

Version 1 intentionally does not support:

- Billing
- AI Services
- Multi-region deployment
- Distributed tracing
- Kubernetes
- Event-driven communication
- Independent Microservices

These capabilities will be introduced incrementally in future releases.