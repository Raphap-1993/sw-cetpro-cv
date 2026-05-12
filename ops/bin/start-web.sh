#!/usr/bin/env sh
set -eu

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname "$0")" && pwd)
. "$SCRIPT_DIR/load-env.sh"

cd "$APP_ROOT"
export NODE_ENV=${NODE_ENV:-production}

exec pnpm --filter @swcv/web exec next start -p "${WEB_PORT:-3010}" -H "${WEB_HOST:-127.0.0.1}"
