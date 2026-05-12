#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_ROOT="${APP_ROOT:-$(cd "$SCRIPT_DIR/../.." && pwd)}"

# shellcheck disable=SC1091
source "$SCRIPT_DIR/load-env.sh"

wait_for_readiness() {
  attempts=${READINESS_ATTEMPTS:-30}
  sleep_seconds=${READINESS_SLEEP_SECONDS:-1}
  current_attempt=1

  while [ "$current_attempt" -le "$attempts" ]; do
    if READINESS_TARGET=internal "$SCRIPT_DIR/check-readiness.sh" >/dev/null 2>&1; then
      return 0
    fi

    sleep "$sleep_seconds"
    current_attempt=$((current_attempt + 1))
  done

  return 1
}

export PM2_APP_PREFIX="${PM2_APP_PREFIX:-rehearsal-}"

"$SCRIPT_DIR/backup-source.sh"
"$SCRIPT_DIR/build-release.sh"

cd "$APP_ROOT"
pm2 startOrReload ops/pm2/ecosystem.config.cjs --env production --update-env
pm2 save

wait_for_readiness

SMOKE_WEB_ORIGIN="http://${WEB_HOST:-127.0.0.1}:${WEB_PORT:-3010}" \
SMOKE_API_BASE_URL="http://${API_HOST:-127.0.0.1}:${API_PORT:-4010}/api" \
SMOKE_LEAD_MARKER="${SMOKE_LEAD_MARKER:-REHEARSAL-$(date +%Y%m%d-%H%M%S)}" \
"$SCRIPT_DIR/smoke-public.sh"

if [ "${KEEP_REHEARSAL_ONLINE:-0}" != "1" ]; then
  "$SCRIPT_DIR/teardown-rehearsal.sh"
fi
