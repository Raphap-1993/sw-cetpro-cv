#!/usr/bin/env sh
set -eu

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname "$0")" && pwd)
. "$SCRIPT_DIR/load-env.sh"

cd "$APP_ROOT"
pnpm --filter @swcv/api exec prisma migrate deploy
