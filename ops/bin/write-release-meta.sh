#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_ROOT="${APP_ROOT:-$(cd "$SCRIPT_DIR/../.." && pwd)}"
OUTPUT_FILE="${1:-$APP_ROOT/.release-meta.env}"

cd "$APP_ROOT"

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "This command must run inside a git worktree." >&2
  exit 1
fi

if ! git rev-parse --verify HEAD >/dev/null 2>&1; then
  echo "At least one commit is required before writing release metadata." >&2
  exit 1
fi

release_sha="$(git rev-parse HEAD)"
release_short_sha="$(git rev-parse --short HEAD)"
release_tag="$(git describe --tags --exact-match 2>/dev/null || true)"
release_branch="$(git rev-parse --abbrev-ref HEAD)"
release_created_at="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"

cat >"$OUTPUT_FILE" <<EOF
RELEASE_GIT_SHA="$release_sha"
RELEASE_GIT_SHORT_SHA="$release_short_sha"
RELEASE_GIT_TAG="$release_tag"
RELEASE_GIT_BRANCH="$release_branch"
RELEASE_CREATED_AT="$release_created_at"
EOF

printf '%s\n' "Release metadata written to $OUTPUT_FILE"
