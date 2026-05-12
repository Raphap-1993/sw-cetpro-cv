#!/usr/bin/env sh
set -eu

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname "$0")" && pwd)
. "$SCRIPT_DIR/load-env.sh"

cd "$APP_ROOT"
export NODE_ENV=${NODE_ENV:-production}

exec pnpm --filter @swcv/api start
