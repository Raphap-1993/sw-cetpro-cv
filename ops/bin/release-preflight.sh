#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_ROOT="${APP_ROOT:-$(cd "$SCRIPT_DIR/../.." && pwd)}"

cd "$APP_ROOT"

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "This command must run inside a git worktree." >&2
  exit 1
fi

if ! git rev-parse --verify HEAD >/dev/null 2>&1; then
  echo "At least one commit is required before running release preflight." >&2
  exit 1
fi

if [[ "${REQUIRE_CLEAN_WORKTREE:-1}" == "1" ]] && [[ -n "$(git status --short)" ]]; then
  echo "Release preflight requires a clean worktree." >&2
  git status --short >&2
  exit 1
fi

pnpm lint
pnpm typecheck
pnpm build

printf '%s\n' "Release preflight passed for $(git rev-parse --short HEAD)"
