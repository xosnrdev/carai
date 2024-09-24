#!/usr/bin/env bash
set -x
set -eo pipefail

# Load environment variables from the .env file if it exists
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
else
  echo >&2 ".env file is missing."
  exit 1
fi

# Check if sqlx is installed
if ! [ -x "$(command -v sqlx)" ]; then
  echo >&2 "Error: sqlx is not installed."
  echo >&2 "Use:"
  echo >&2 "    cargo install --version='~0.8' sqlx-cli --no-default-features --features rustls,postgres"
  echo >&2 "to install it."
  exit 1
fi

# Allow to skip Docker if a dockerized Postgres database is already running
if [[ -z "${SKIP_DOCKER}" ]]; then
  RUNNING_POSTGRES_CONTAINER=$(docker ps --filter 'name=postgres' --format '{{.ID}}')
  if [[ -n $RUNNING_POSTGRES_CONTAINER ]]; then
    echo >&2 "there is a postgres container already running, kill it with"
    echo >&2 "    docker kill ${RUNNING_POSTGRES_CONTAINER}"
    exit 1
  fi

  CONTAINER_NAME="postgres_$(date '+%s')"

  docker run \
      --env POSTGRES_USER="${SUPERUSER}" \
      --env POSTGRES_PASSWORD="${SUPERUSER_PASSWORD}" \
      --health-cmd="pg_isready -U ${SUPERUSER} || exit 1" \
      --health-interval=1s \
      --health-timeout=5s \
      --health-retries=5 \
      --publish "${DATABASE_PORT}":5432 \
      --detach \
      --name "${CONTAINER_NAME}" \
      postgres -N 1000

  until [ "$(docker inspect -f "{{.State.Health.Status}}" "${CONTAINER_NAME}")" == "healthy" ]; do
    >&2 echo "Postgres is still unavailable - sleeping"
    sleep 1
  done

  CREATE_QUERY="CREATE USER ${DATABASE_USERNAME} WITH PASSWORD '${DATABASE_PASSWORD}';"
  docker exec -it "${CONTAINER_NAME}" psql -U "${SUPERUSER}" -c "${CREATE_QUERY}"

  GRANT_QUERY="ALTER USER ${DATABASE_USERNAME} CREATEDB;"
  docker exec -it "${CONTAINER_NAME}" psql -U "${SUPERUSER}" -c "${GRANT_QUERY}"
fi

>&2 echo "Postgres is up and running on port ${DATABASE_PORT} - running migrations now!"

DATABASE_HOST=postgres://${DATABASE_USERNAME}:${DATABASE_PASSWORD}@localhost:${DATABASE_PORT}/${DATABASE_NAME}
export DATABASE_HOST
sqlx database create
sqlx migrate run

>&2 echo "Postgres has been migrated, ready to go!"
