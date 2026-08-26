#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

echo "==============================================="
echo " Starting Developer Platform Deployment Script "
echo "==============================================="

# Navigate to the project root
cd "$(dirname "$0")/.."

# Variables
ENV_FILE="./.env.prod"
DOCKER_COMPOSE_FILE="./infrastructure/docker/docker-compose.prod.yml"

echo "[1/4] Checking environment variables..."
if [ ! -f "$ENV_FILE" ]; then
    echo "Error: $ENV_FILE not found! Please create it with production secrets."
    exit 1
fi

echo "[2/4] Pulling latest code..."
git pull origin main

echo "[3/4] Building production images..."
# Source env vars for docker-compose interpolation
export $(grep -v '^#' $ENV_FILE | xargs)
docker compose -f $DOCKER_COMPOSE_FILE build

echo "[4/4] Deploying containers with zero downtime..."
# --build is not strictly necessary since we just built, but good practice
# -d runs in detached mode
docker compose -f $DOCKER_COMPOSE_FILE up -d --remove-orphans

echo "==============================================="
echo " Deployment Successful!                        "
echo "==============================================="
echo "You can check the logs using:"
echo "docker compose -f $DOCKER_COMPOSE_FILE logs -f"
