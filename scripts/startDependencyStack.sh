#!/usr/bin/env bash

export COMPOSE_FILE=${COMPOSE_FILE:="docker-compose.yml"}

find_container_id() {
    echo $(docker ps \
  --filter "status=running" \
  --filter "label=custom.project=mates-rates" \
  --filter "label=custom.service=postgres" \
  --no-trunc \
  -q)
}

quit() {
  docker compose -f "${COMPOSE_FILE}" down --remove-orphans
  exit 1
}

if [ -z ${DO_NOT_STOP} ]; then
  echo "Docker containers init"
  NO_LOGS=1 $PWD/scripts/dockerComposeInit.sh
  if [ "1" = "$?" ]; then
    echo -e "Failed to start containers"
    exit 1
  fi
fi

$PWD/scripts/waitForDependency.mjs
