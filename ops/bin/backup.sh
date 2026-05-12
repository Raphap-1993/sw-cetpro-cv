#!/usr/bin/env sh
set -eu

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname "$0")" && pwd)
. "$SCRIPT_DIR/load-env.sh"

backup_root=${BACKUP_ROOT:-"$APP_ROOT/var/backups"}
retention_days=${BACKUP_RETENTION_DAYS:-14}
media_dir=${MEDIA_UPLOAD_DIR:-"$APP_ROOT/var/uploads/media"}
pg_dump_bin=${PG_DUMP_BIN:-pg_dump}
docker_pg_container=${PG_DUMP_DOCKER_CONTAINER:-sw_cetpro_cv_postgres}
timestamp=$(date +"%Y-%m-%d-%H%M%S")
target_dir="$backup_root/$timestamp"

case "$media_dir" in
  /*) ;;
  *) media_dir="$APP_ROOT/$media_dir" ;;
esac

database_backup_url=$(node -e 'const url = new URL(process.argv[1]); url.searchParams.delete("schema"); console.log(url.toString())' "$DATABASE_URL")
database_host=$(node -p 'new URL(process.argv[1]).hostname' "$DATABASE_URL")
database_port=$(node -p 'new URL(process.argv[1]).port || "5432"' "$DATABASE_URL")

mkdir -p "$target_dir"

if [ "$database_host" = "127.0.0.1" ] && [ "$database_port" = "54325" ] && command -v docker >/dev/null 2>&1 && docker inspect "$docker_pg_container" >/dev/null 2>&1; then
  database_user=$(node -p 'new URL(process.argv[1]).username' "$DATABASE_URL")
  database_password=$(node -p 'decodeURIComponent(new URL(process.argv[1]).password)' "$DATABASE_URL")
  database_name=$(node -p 'new URL(process.argv[1]).pathname.slice(1)' "$DATABASE_URL")
  PGPASSWORD="$database_password" docker exec -e PGPASSWORD="$database_password" "$docker_pg_container" pg_dump --format=custom -U "$database_user" -d "$database_name" > "$target_dir/database.dump"
  backup_mode="docker:$docker_pg_container"
else
  "$pg_dump_bin" --format=custom --file "$target_dir/database.dump" "$database_backup_url"
  backup_mode="bin:$pg_dump_bin"
fi

if [ -d "$media_dir" ]; then
  tar -C "$media_dir" -czf "$target_dir/media.tar.gz" .
fi

printf '%s\n' "timestamp=$timestamp" > "$target_dir/manifest.txt"
printf '%s\n' "backup_mode=$backup_mode" >> "$target_dir/manifest.txt"
printf '%s\n' "database_dump=$target_dir/database.dump" >> "$target_dir/manifest.txt"
printf '%s\n' "media_dir=$media_dir" >> "$target_dir/manifest.txt"

if [ "$retention_days" -gt 0 ] 2>/dev/null; then
  find "$backup_root" -mindepth 1 -maxdepth 1 -type d -mtime +"$retention_days" -exec rm -rf {} +
fi

printf '%s\n' "Backup created at $target_dir"
