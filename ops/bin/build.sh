#!/usr/bin/env sh
set -eu

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname "$0")" && pwd)
. "$SCRIPT_DIR/load-env.sh"

cd "$APP_ROOT"
pnpm install --frozen-lockfile
pnpm prisma:generate
pnpm build
