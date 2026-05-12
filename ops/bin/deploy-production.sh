#!/usr/bin/env sh
set -eu

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname "$0")" && pwd)
. "$SCRIPT_DIR/load-env.sh"

wait_for_readiness() {
  target=${1:-internal}
  attempts=${READINESS_ATTEMPTS:-30}
  sleep_seconds=${READINESS_SLEEP_SECONDS:-1}
  current_attempt=1

  while [ "$current_attempt" -le "$attempts" ]; do
    if READINESS_TARGET="$target" "$SCRIPT_DIR/check-readiness.sh" >/dev/null 2>&1; then
      return 0
    fi

    sleep "$sleep_seconds"
    current_attempt=$((current_attempt + 1))
  done

  return 1
}

printf '%s\n' "Starting pre-deploy backup..."
"$SCRIPT_DIR/backup.sh"
"$SCRIPT_DIR/backup-source.sh"

printf '%s\n' "Building release..."
"$SCRIPT_DIR/build-release.sh"

printf '%s\n' "Reloading PM2 processes..."
cd "$APP_ROOT"
pm2 startOrReload ops/pm2/ecosystem.config.cjs --env production --update-env
pm2 save

printf '%s\n' "Running internal readiness checks..."
wait_for_readiness internal
printf '%s\n' "Internal readiness checks passed"

if [ "${RUN_PUBLIC_SMOKE:-1}" = "1" ] && [ "${SKIP_PUBLIC_SMOKE:-0}" != "1" ]; then
  printf '%s\n' "Running public smoke gate..."
  SMOKE_LEAD_MARKER="${SMOKE_LEAD_MARKER:-RELEASE-$(date +%Y%m%d-%H%M%S)}" \
    "$SCRIPT_DIR/smoke-public.sh"
  printf '%s\n' "Public smoke gate passed"
elif [ "${SKIP_PUBLIC_SMOKE:-0}" = "1" ]; then
  printf '%s\n' "Public smoke gate skipped by SKIP_PUBLIC_SMOKE=1"
fi

printf '%s\n' "Production deploy completed"
