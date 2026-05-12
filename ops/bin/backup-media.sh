#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_ROOT="${APP_ROOT:-$(cd "$SCRIPT_DIR/../.." && pwd)}"

# shellcheck disable=SC1091
source "$SCRIPT_DIR/load-env.sh"

MEDIA_UPLOAD_DIR="${MEDIA_UPLOAD_DIR:-$APP_ROOT/var/uploads/media}"
BACKUP_DIR="${BACKUP_DIR:-${BACKUP_ROOT:-$APP_ROOT/var/backups}/media}"

if [[ "$MEDIA_UPLOAD_DIR" != /* ]]; then
  MEDIA_UPLOAD_DIR="$APP_ROOT/$MEDIA_UPLOAD_DIR"
fi

mkdir -p "$BACKUP_DIR"

if [[ ! -d "$MEDIA_UPLOAD_DIR" ]]; then
  echo "Media directory not found: $MEDIA_UPLOAD_DIR" >&2
  exit 1
fi

BACKUP_FILE="$BACKUP_DIR/swcv-media-$(date +%F-%H%M%S).tar.gz"
tar -czf "$BACKUP_FILE" -C "$MEDIA_UPLOAD_DIR" .

echo "$BACKUP_FILE"
