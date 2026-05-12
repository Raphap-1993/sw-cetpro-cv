#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_ROOT="${APP_ROOT:-$(cd "$SCRIPT_DIR/../.." && pwd)}"
requested_pm2_prefix="${PM2_APP_PREFIX:-}"
requested_legacy_unprefixed="${REHEARSAL_LEGACY_UNPREFIXED:-}"

# shellcheck disable=SC1091
source "$SCRIPT_DIR/load-env.sh"

rehearsal_prefix="${requested_pm2_prefix:-${PM2_APP_PREFIX:-rehearsal-}}"
legacy_unprefixed="${requested_legacy_unprefixed:-${REHEARSAL_LEGACY_UNPREFIXED:-0}}"

if [[ "$rehearsal_prefix" == "prod-" || "$rehearsal_prefix" == "production-" ]]; then
  echo "Refusing to teardown production PM2 prefix: $rehearsal_prefix" >&2
  exit 1
fi

targets=("${rehearsal_prefix}swcv-api" "${rehearsal_prefix}swcv-web")

if [[ "$legacy_unprefixed" == "1" ]]; then
  targets+=("swcv-api" "swcv-web")
fi

deleted_any=0

for app_name in "${targets[@]}"; do
  if pm2 describe "$app_name" >/dev/null 2>&1; then
    pm2 delete "$app_name" >/dev/null
    printf '%s\n' "Removed PM2 app $app_name"
    deleted_any=1
  fi
done

if [[ "$deleted_any" == "1" ]]; then
  pm2 save >/dev/null
else
  printf '%s\n' "No rehearsal PM2 apps found."
fi
