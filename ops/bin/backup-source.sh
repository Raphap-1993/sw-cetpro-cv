#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_ROOT="${APP_ROOT:-$(cd "$SCRIPT_DIR/../.." && pwd)}"

# shellcheck disable=SC1091
source "$SCRIPT_DIR/load-env.sh"

timestamp="$(date +"%Y-%m-%d-%H%M%S")"
backup_root="${SOURCE_BACKUP_ROOT:-${BACKUP_ROOT:-$APP_ROOT/var/backups}/source-baselines}"
target_file="$backup_root/sw-cetpro-cv-source-$timestamp.tar.gz"
manifest_file="$backup_root/sw-cetpro-cv-source-$timestamp.manifest.txt"
checksum_file="$backup_root/sw-cetpro-cv-source-$timestamp.sha256"
release_meta_file="${RELEASE_META_FILE:-$APP_ROOT/.release-meta.env}"

mkdir -p "$backup_root"

tar \
  --exclude='.git' \
  --exclude='node_modules' \
  --exclude='apps/web/.next' \
  --exclude='apps/api/dist' \
  --exclude='var' \
  --exclude='.env' \
  -C "$APP_ROOT" \
  -czf "$target_file" \
  .

archive_size_bytes="$(wc -c < "$target_file" | tr -d '[:space:]')"

release_git_sha="${RELEASE_GIT_SHA:-}"
release_git_short_sha="${RELEASE_GIT_SHORT_SHA:-}"
release_git_tag="${RELEASE_GIT_TAG:-}"
release_git_branch="${RELEASE_GIT_BRANCH:-}"
release_created_at="${RELEASE_CREATED_AT:-}"

if [ -f "$release_meta_file" ]; then
  # shellcheck disable=SC1090
  . "$release_meta_file"
  release_git_sha="${RELEASE_GIT_SHA:-$release_git_sha}"
  release_git_short_sha="${RELEASE_GIT_SHORT_SHA:-$release_git_short_sha}"
  release_git_tag="${RELEASE_GIT_TAG:-$release_git_tag}"
  release_git_branch="${RELEASE_GIT_BRANCH:-$release_git_branch}"
  release_created_at="${RELEASE_CREATED_AT:-$release_created_at}"
elif git -C "$APP_ROOT" rev-parse --is-inside-work-tree >/dev/null 2>&1 && git -C "$APP_ROOT" rev-parse --verify HEAD >/dev/null 2>&1; then
  release_git_sha="$(git -C "$APP_ROOT" rev-parse HEAD)"
  release_git_short_sha="$(git -C "$APP_ROOT" rev-parse --short HEAD)"
  release_git_tag="$(git -C "$APP_ROOT" describe --tags --exact-match 2>/dev/null || true)"
  release_git_branch="$(git -C "$APP_ROOT" rev-parse --abbrev-ref HEAD)"
  release_created_at="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
fi

cat >"$manifest_file" <<EOF
archive=$target_file
created_at=$timestamp
app_root=$APP_ROOT
size_bytes=$archive_size_bytes
release_git_sha=$release_git_sha
release_git_short_sha=$release_git_short_sha
release_git_tag=$release_git_tag
release_git_branch=$release_git_branch
release_created_at=$release_created_at
EOF

if command -v sha256sum >/dev/null 2>&1; then
  sha256sum "$target_file" > "$checksum_file"
elif command -v shasum >/dev/null 2>&1; then
  shasum -a 256 "$target_file" > "$checksum_file"
fi

printf '%s\n' "Source snapshot created at $target_file"
printf '%s\n' "Manifest created at $manifest_file"
if [ -f "$checksum_file" ]; then
  printf '%s\n' "Checksum created at $checksum_file"
fi
