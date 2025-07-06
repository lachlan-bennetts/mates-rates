#!/bin/bash

COMPOSE_FILE=${COMPOSE_FILE:="docker-compose.yml"}

echo "Running compose file: ${COMPOSE_FILE}:"
docker compose -f "${COMPOSE_FILE}" up --force-recreate -d
if [ -z ${NO_LOGS} ]; then
  docker compose -f "${COMPOSE_FILE}" logs -f
fi
