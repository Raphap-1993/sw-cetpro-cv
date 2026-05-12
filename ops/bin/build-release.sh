#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_ROOT="${APP_ROOT:-$(cd "$SCRIPT_DIR/../.." && pwd)}"

# shellcheck disable=SC1091
source "$SCRIPT_DIR/load-env.sh"

cd "$APP_ROOT"

corepack enable
pnpm install --frozen-lockfile
pnpm prisma:generate
pnpm prisma:deploy
pnpm build

if [[ "${RUN_SEED_ON_DEPLOY:-0}" == "1" ]]; then
  pnpm prisma:seed
fi
