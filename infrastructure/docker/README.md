# Docker Infrastructure

## Purpose

This directory contains the Docker Compose configuration used to provision the local development infrastructure for the Developer Platform.

The goal is to provide a consistent and reproducible development environment so that every developer can start the required services with a single command without manually installing or configuring databases and cache servers.

---

# Infrastructure Components

The current infrastructure consists of the following services:

| Service | Version | Purpose |
|----------|---------|---------|
| PostgreSQL | 17 | Primary relational database |
| Redis | 8 | Distributed cache and future session store |

---

# Directory Structure

```text
docker/
├── docker-compose.yml
├── .env
└── README.md
```

---

# Prerequisites

Before running the infrastructure, ensure the following software is installed:

- Docker Engine
- Docker Compose

Verify installation:

```bash
docker --version
docker compose version
```

---

# Starting the Infrastructure

Navigate to the docker directory.

```bash
cd infrastructure/docker
```

Start all services.

```bash
docker compose up -d
```

Docker will automatically:

- Create the required network
- Create the required Docker volume
- Pull images (if not available locally)
- Start PostgreSQL
- Start Redis

---

# Stopping the Infrastructure

Stop the running containers.

```bash
docker compose down
```

The PostgreSQL data remains safe because it is stored in a named Docker volume.

---

# Removing Containers and Volumes

To completely remove the infrastructure including the PostgreSQL data:

```bash
docker compose down -v
```

> **Warning**
>
> This permanently deletes the PostgreSQL database.

---

# Restarting Services

```bash
docker compose restart
```

Restart a specific service.

```bash
docker compose restart postgres
```

```bash
docker compose restart redis
```

---

# Viewing Running Containers

```bash
docker ps
```

Expected output:

- developer-platform-postgres
- developer-platform-redis

---

# Viewing Logs

### PostgreSQL

```bash
docker logs developer-platform-postgres
```

### Redis

```bash
docker logs developer-platform-redis
```

Follow logs continuously.

```bash
docker logs -f developer-platform-postgres
```

---

# Checking Container Health

```bash
docker inspect developer-platform-postgres
```

```bash
docker inspect developer-platform-redis
```

Both services should report:

```
healthy
```

---

# Connecting to PostgreSQL

Using psql:

```bash
psql \
-h localhost \
-p 5433 \
-U postgres \
-d developer_platform
```

---

# Connecting to Redis

Using redis-cli:

```bash
redis-cli -p 6370
```

Test the connection:

```text
PING
```

Expected response:

```text
PONG
```

---

# Docker Resources

## Network

```
developer-platform-network
```

View available networks.

```bash
docker network ls
```

Inspect the network.

```bash
docker network inspect developer-platform-network
```

---

## Volume

```
developer-platform-postgres-data
```

View volumes.

```bash
docker volume ls
```

Inspect the PostgreSQL volume.

```bash
docker volume inspect developer-platform-postgres-data
```

---

# Environment Variables

Docker Compose reads configuration from the `.env` file.

Example:

```properties
POSTGRES_DB=developer_platform
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres

POSTGRES_PORT=5433

REDIS_PORT=6370
```

Using environment variables allows configuration changes without modifying the Docker Compose file.

---

# Service Ports

| Service | Host Port | Container Port |
|----------|----------:|---------------:|
| PostgreSQL | 5433 | 5432 |
| Redis | 6370 | 6379 |

These host ports were selected to avoid conflicts with locally installed PostgreSQL and Redis instances.

---

# Design Decisions

## Why Docker Compose?

- Consistent development environment
- Easy onboarding for new developers
- Infrastructure as code
- Eliminates manual installation steps

---

## Why PostgreSQL?

- Open-source relational database
- ACID compliant
- Excellent Spring Boot support
- Suitable for transactional workloads

---

## Why Redis?

Redis will be used for:

- Application caching
- Session storage (future)
- Rate limiting (future)
- Distributed locking (future)

---

## Why Named Volumes?

PostgreSQL data is stored in a Docker volume to ensure data persists even when containers are recreated.

---

## Why a Custom Docker Network?

A dedicated Docker network provides:

- Service isolation
- Reliable container-to-container communication
- Easier future expansion

---

## Why Health Checks?

Health checks ensure services are fully initialized before dependent applications connect to them.

This prevents startup failures caused by services that are running but not yet ready to accept connections.

---

# Troubleshooting

## Port Already in Use

Check which process is using a port.

```bash
sudo lsof -i :5432
```

```bash
sudo lsof -i :6379
```

Update the `.env` file if different host ports are required.

---

## View Container Status

```bash
docker compose ps
```

---

## Recreate Containers

```bash
docker compose down
docker compose up -d
```

---

# Future Enhancements

The infrastructure will be expanded in future iterations to include:

- Flyway database migrations
- pgAdmin
- Nginx reverse proxy
- Spring Boot containerization
- Prometheus
- Grafana
- ELK Stack
- Kubernetes deployment

---

# References

- Docker Documentation
- Docker Compose Documentation
- PostgreSQL Documentation
- Redis Documentation