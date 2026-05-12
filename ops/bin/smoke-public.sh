#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_ROOT="${APP_ROOT:-$(cd "$SCRIPT_DIR/../.." && pwd)}"

# shellcheck disable=SC1091
source "$SCRIPT_DIR/load-env.sh"

trim_trailing_slash() {
  printf '%s' "${1%/}"
}

to_lower_ascii() {
  printf '%s' "$1" | tr '[:upper:]' '[:lower:]'
}

get_latest_rotation_file() {
  local rotation_root="$1"

  if [[ -f "$rotation_root/latest-admin-credentials.env" ]]; then
    printf '%s\n' "$rotation_root/latest-admin-credentials.env"
    return 0
  fi

  find "$rotation_root" -maxdepth 1 -type f -name 'admin-credentials-*.env' | sort | tail -n 1
}

read_secret_field() {
  local file_path="$1"
  local field_name="$2"
  node - "$file_path" "$field_name" <<'EOF'
const fs = require("node:fs");
const filePath = process.argv[2];
const fieldName = process.argv[3];
const content = fs.readFileSync(filePath, "utf8").trim();
const match = content.match(new RegExp(`^${fieldName}="?(.*?)"?$`, "m"));

if (match?.[1]) {
  process.stdout.write(match[1]);
  process.exit(0);
}

process.exit(1);
EOF
}

WEB_BASE="$(trim_trailing_slash "${SMOKE_WEB_ORIGIN:-${PUBLIC_WEB_ORIGIN:-${WEB_ORIGIN%%,*}}}")"
API_BASE="$(trim_trailing_slash "${SMOKE_API_BASE_URL:-${NEXT_PUBLIC_API_URL:-}}")"
WEB_LEADS_URL="$(trim_trailing_slash "${SMOKE_WEB_LEADS_URL:-$WEB_BASE/api/leads}")"
PROGRAM_SLUG="${SMOKE_PROGRAM_SLUG:-programacion-de-sistemas-de-informacion}"
LEAD_MARKER="${SMOKE_LEAD_MARKER:-SMOKE-$(date +%Y%m%d-%H%M%S)}"
ADMIN_EMAIL="${SMOKE_ADMIN_EMAIL:-}"
ADMIN_PASSWORD="${SMOKE_ADMIN_PASSWORD:-}"
ROTATION_ROOT="${ADMIN_ROTATION_ARCHIVE_DIR:-$(dirname "$APP_ENV_FILE")/rotations}"
default_credentials_file=""
normalized_marker="$(to_lower_ascii "$LEAD_MARKER")"

if [[ -z "$WEB_BASE" || -z "$API_BASE" ]]; then
  echo "SMOKE_WEB_ORIGIN/PUBLIC_WEB_ORIGIN and SMOKE_API_BASE_URL/NEXT_PUBLIC_API_URL are required." >&2
  exit 1
fi

if [[ -d "$ROTATION_ROOT" ]]; then
  default_credentials_file="$(get_latest_rotation_file "$ROTATION_ROOT" || true)"
fi

if [[ -z "${SMOKE_ADMIN_PASSWORD_FILE:-}" && -n "$default_credentials_file" ]]; then
  SMOKE_ADMIN_PASSWORD_FILE="$default_credentials_file"
fi

if [[ -z "${SMOKE_ADMIN_EMAIL_FILE:-}" && -n "$default_credentials_file" ]]; then
  SMOKE_ADMIN_EMAIL_FILE="$default_credentials_file"
fi

if [[ -z "$ADMIN_PASSWORD" && -n "${SMOKE_ADMIN_PASSWORD_FILE:-}" ]]; then
  ADMIN_PASSWORD="$(read_secret_field "$SMOKE_ADMIN_PASSWORD_FILE" "ADMIN_PASSWORD")"
fi

if [[ -z "$ADMIN_EMAIL" && -n "${SMOKE_ADMIN_EMAIL_FILE:-}" ]]; then
  ADMIN_EMAIL="$(read_secret_field "$SMOKE_ADMIN_EMAIL_FILE" "ADMIN_EMAIL")"
fi

ADMIN_EMAIL="${ADMIN_EMAIL:-${SEED_ADMIN_EMAIL:-}}"
ADMIN_PASSWORD="${ADMIN_PASSWORD:-${SEED_ADMIN_PASSWORD:-}}"

health_file="$(mktemp)"
home_file="$(mktemp)"
catalog_file="$(mktemp)"
detail_file="$(mktemp)"
program_file="$(mktemp)"
admin_login_page_file="$(mktemp)"
login_fail_file="$(mktemp)"
login_ok_file="$(mktemp)"
leads_file="$(mktemp)"

cleanup() {
  rm -f "$health_file" "$home_file" "$catalog_file" "$detail_file" "$program_file" \
    "$admin_login_page_file" "$login_fail_file" "$login_ok_file" "$leads_file"
}
trap cleanup EXIT

curl -fsS "$API_BASE/health/ready" > "$health_file"
node - "$health_file" <<'EOF'
const fs = require("node:fs");
const payload = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
if (!payload.ok || !payload.checks?.database?.ok || !payload.checks?.media?.ok) {
  throw new Error("Health readiness failed");
}
EOF

curl -fsS "$WEB_BASE/" > "$home_file"
curl -fsS "$WEB_BASE/programas" > "$catalog_file"
curl -fsS "$WEB_BASE/programas/$PROGRAM_SLUG" > "$detail_file"
curl -fsS "$WEB_BASE/admin/login" > "$admin_login_page_file"

node - "$home_file" "$catalog_file" "$detail_file" "$admin_login_page_file" <<'EOF'
const fs = require("node:fs");
const files = process.argv.slice(2);
for (const file of files) {
  const html = fs.readFileSync(file, "utf8");
  if (/wp-content|wordpress/i.test(html)) {
    throw new Error(`Legacy WordPress reference found in ${file}`);
  }
}
EOF

curl -fsS "$API_BASE/programs/$PROGRAM_SLUG" > "$program_file"
PROGRAM_ID="$(node -e 'const fs=require("node:fs");const program=JSON.parse(fs.readFileSync(process.argv[1],"utf8"));if(!program?.id){process.exit(1)}process.stdout.write(program.id)' "$program_file")"
MEDIA_URL="$(node -e 'const fs=require("node:fs");const program=JSON.parse(fs.readFileSync(process.argv[1],"utf8"));process.stdout.write(program.imageUrl || "")' "$program_file")"

if [[ -z "$MEDIA_URL" ]]; then
  echo "Program imageUrl is empty for smoke target." >&2
  exit 1
fi

if [[ "$MEDIA_URL" == /* ]]; then
  MEDIA_URL="$WEB_BASE$MEDIA_URL"
fi

curl -fsSI "$MEDIA_URL" > /dev/null

curl -fsS \
  -H 'content-type: application/json' \
  -d "{\"fullName\":\"Smoke Home ${LEAD_MARKER}\",\"phone\":\"+51999888777\",\"email\":\"${normalized_marker}-home@cetpro-smoke.local\",\"message\":\"Smoke home ${LEAD_MARKER}\"}" \
  "$WEB_LEADS_URL" > /dev/null

curl -fsS \
  -H 'content-type: application/json' \
  -d "{\"fullName\":\"Smoke Detail ${LEAD_MARKER}\",\"phone\":\"+51999888666\",\"email\":\"${normalized_marker}-detail@cetpro-smoke.local\",\"message\":\"Smoke detail ${LEAD_MARKER}\",\"programId\":\"$PROGRAM_ID\"}" \
  "$WEB_LEADS_URL" > /dev/null

if [[ -n "$ADMIN_EMAIL" && -n "$ADMIN_PASSWORD" ]]; then
  set +e
  curl -sS -o "$login_fail_file" -w '%{http_code}' \
    -H 'content-type: application/json' \
    -d "{\"email\":\"$ADMIN_EMAIL\",\"password\":\"${ADMIN_PASSWORD}--wrong\"}" \
    "$API_BASE/auth/login" | grep -qx '401'
  set -e

  curl -fsS \
    -H 'content-type: application/json' \
    -d "{\"email\":\"$ADMIN_EMAIL\",\"password\":\"$ADMIN_PASSWORD\"}" \
    "$API_BASE/auth/login" > "$login_ok_file"
  ACCESS_TOKEN="$(node -e 'const fs=require("node:fs");const payload=JSON.parse(fs.readFileSync(process.argv[1],"utf8"));if(!payload?.accessToken){process.exit(1)}process.stdout.write(payload.accessToken)' "$login_ok_file")"

  curl -fsS -H "authorization: Bearer $ACCESS_TOKEN" "$API_BASE/leads" > "$leads_file"
  node - "$leads_file" "$LEAD_MARKER" "$PROGRAM_ID" <<'EOF'
const fs = require("node:fs");
const leads = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
const marker = process.argv[3];
const programId = process.argv[4];
const homeLead = leads.find((lead) => lead.fullName === `Smoke Home ${marker}`);
const detailLead = leads.find((lead) => lead.fullName === `Smoke Detail ${marker}`);

if (!homeLead || !detailLead) {
  throw new Error("Smoke leads were not found in admin list");
}

if (detailLead.programId !== programId) {
  throw new Error("Detail smoke lead was not linked to the expected program");
}
EOF
fi

printf '%s\n' "Smoke public passed for $WEB_BASE with marker $LEAD_MARKER"
