#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_ROOT="${APP_ROOT:-$(cd "$SCRIPT_DIR/../.." && pwd)}"
TAG_NAME="${1:-${RELEASE_TAG:-}}"

if [[ -z "$TAG_NAME" ]]; then
  echo "Usage: ./ops/bin/release-tag.sh <tag-name>" >&2
  exit 1
fi

cd "$APP_ROOT"

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "This command must run inside a git worktree." >&2
  exit 1
fi

if [[ "${RUN_RELEASE_PREFLIGHT:-1}" == "1" ]]; then
  "$SCRIPT_DIR/release-preflight.sh"
fi

if [[ -n "$(git status --short)" ]]; then
  echo "Release tag requires a clean worktree." >&2
  git status --short >&2
  exit 1
fi

if git rev-parse --verify "$TAG_NAME" >/dev/null 2>&1; then
  echo "Tag already exists: $TAG_NAME" >&2
  exit 1
fi

tag_message="${RELEASE_TAG_MESSAGE:-Release $TAG_NAME}"
git tag -a "$TAG_NAME" -m "$tag_message"
"$SCRIPT_DIR/write-release-meta.sh" >/dev/null

printf '%s\n' "Created release tag $TAG_NAME at $(git rev-parse --short HEAD)"
