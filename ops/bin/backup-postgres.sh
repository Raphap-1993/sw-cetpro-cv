#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_ROOT="${APP_ROOT:-$(cd "$SCRIPT_DIR/../.." && pwd)}"

# shellcheck disable=SC1091
source "$SCRIPT_DIR/load-env.sh"

if [[ -z "${DATABASE_URL:-}" ]]; then
  echo "DATABASE_URL is required." >&2
  exit 1
fi

BACKUP_DIR="${BACKUP_DIR:-${BACKUP_ROOT:-$APP_ROOT/var/backups}/postgres}"
PG_DUMP_BIN="${PG_DUMP_BIN:-pg_dump}"
DOCKER_PG_CONTAINER="${PG_DUMP_DOCKER_CONTAINER:-sw_cetpro_cv_postgres}"
mkdir -p "$BACKUP_DIR"

BACKUP_FILE="$BACKUP_DIR/swcv-$(date +%F-%H%M%S).sql"
DATABASE_BACKUP_URL="$(node -e 'const url = new URL(process.argv[1]); url.searchParams.delete("schema"); console.log(url.toString())' "$DATABASE_URL")"
DATABASE_HOST="$(node -p 'new URL(process.argv[1]).hostname' "$DATABASE_URL")"
DATABASE_PORT="$(node -p 'new URL(process.argv[1]).port || "5432"' "$DATABASE_URL")"

if [[ "$DATABASE_HOST" == "127.0.0.1" && "$DATABASE_PORT" == "54325" ]] && command -v docker >/dev/null 2>&1 && docker inspect "$DOCKER_PG_CONTAINER" >/dev/null 2>&1; then
  DATABASE_USER="$(node -p 'new URL(process.argv[1]).username' "$DATABASE_URL")"
  DATABASE_PASSWORD="$(node -p 'decodeURIComponent(new URL(process.argv[1]).password)' "$DATABASE_URL")"
  DATABASE_NAME="$(node -p 'new URL(process.argv[1]).pathname.slice(1)' "$DATABASE_URL")"
  PGPASSWORD="$DATABASE_PASSWORD" docker exec -e PGPASSWORD="$DATABASE_PASSWORD" "$DOCKER_PG_CONTAINER" pg_dump -U "$DATABASE_USER" -d "$DATABASE_NAME" > "$BACKUP_FILE"
else
  "$PG_DUMP_BIN" "$DATABASE_BACKUP_URL" > "$BACKUP_FILE"
fi

echo "$BACKUP_FILE"
