#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_ROOT="${APP_ROOT:-$(cd "$SCRIPT_DIR/../.." && pwd)}"

# shellcheck disable=SC1091
source "$SCRIPT_DIR/load-env.sh"

admin_email="${ROTATE_ADMIN_EMAIL:-${SEED_ADMIN_EMAIL:-}}"

if [[ -z "$admin_email" ]]; then
  echo "Missing ROTATE_ADMIN_EMAIL or SEED_ADMIN_EMAIL." >&2
  exit 1
fi

timestamp="$(date +"%Y-%m-%d-%H%M%S")"
rotation_root="${ADMIN_ROTATION_ARCHIVE_DIR:-$(dirname "$APP_ENV_FILE")/rotations}"
env_backup="$rotation_root/$(basename "$APP_ENV_FILE").$timestamp.bak"
credentials_file="$rotation_root/admin-credentials-$timestamp.env"
latest_credentials_file="$rotation_root/latest-admin-credentials.env"

generate_secret() {
  node -e 'process.stdout.write(require("node:crypto").randomBytes(48).toString("base64url"))'
}

new_admin_password="${ROTATE_ADMIN_PASSWORD:-$(generate_secret)}"
new_seed_admin_password="${ROTATE_SEED_ADMIN_PASSWORD:-$(generate_secret)}"
new_jwt_secret="${ROTATE_JWT_ACCESS_SECRET:-$(generate_secret)}"
new_admin_session_secret="${ROTATE_ADMIN_SESSION_SECRET:-$(generate_secret)}"
new_next_session_secret="${ROTATE_NEXT_SESSION_SECRET:-$new_admin_session_secret}"

mkdir -p "$rotation_root"
chmod 700 "$rotation_root"
cp "$APP_ENV_FILE" "$env_backup"
chmod 600 "$env_backup"

upsert_env_var() {
  local key="$1"
  local value="$2"

  node - "$APP_ENV_FILE" "$key" "$value" <<'EOF'
const fs = require("node:fs");

const [, , filePath, key, value] = process.argv;
const content = fs.readFileSync(filePath, "utf8");
const line = `${key}="${value}"`;
const pattern = new RegExp(`^${key}=.*$`, "m");
const nextContent = pattern.test(content)
  ? content.replace(pattern, line)
  : `${content.trimEnd()}\n${line}\n`;

fs.writeFileSync(filePath, nextContent);
EOF
}

upsert_env_var "JWT_ACCESS_SECRET" "$new_jwt_secret"
upsert_env_var "ADMIN_SESSION_SECRET" "$new_admin_session_secret"
upsert_env_var "NEXT_SESSION_SECRET" "$new_next_session_secret"
upsert_env_var "SEED_ADMIN_PASSWORD" "$new_seed_admin_password"
upsert_env_var "SEED_ADMIN_FORCE_PASSWORD_RESET" "false"

cd "$APP_ROOT"
ROTATE_ADMIN_EMAIL="$admin_email" \
ROTATE_ADMIN_PASSWORD="$new_admin_password" \
pnpm --filter @swcv/api exec tsx prisma/scripts/rotate-admin-password.ts

cat >"$credentials_file" <<EOF
ROTATED_AT="$timestamp"
ADMIN_EMAIL="$admin_email"
ADMIN_PASSWORD="$new_admin_password"
ENV_BACKUP="$env_backup"
EOF

chmod 600 "$credentials_file"
ln -sfn "$(basename "$credentials_file")" "$latest_credentials_file"

printf '%s\n' "Admin access rotated for $admin_email"
printf '%s\n' "Env backup: $env_backup"
printf '%s\n' "Credential envelope: $credentials_file"
printf '%s\n' "Latest credential envelope: $latest_credentials_file"
