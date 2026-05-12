#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_ROOT="${APP_ROOT:-$(cd "$SCRIPT_DIR/../.." && pwd)}"
OUTPUT_DIR="${1:-${LEGACY_MEDIA_SOURCE_OUTPUT_DIR:-$APP_ROOT/var/legacy-media-source}}"
BRAND_DIR="$APP_ROOT/apps/web/public/brand"

if ! command -v sips >/dev/null 2>&1; then
  echo "sips is required to render the legacy media source pack." >&2
  exit 1
fi

mkdir -p "$OUTPUT_DIR/wp-content/uploads/2022/07" "$OUTPUT_DIR/wp-content/uploads/2023/02"

node "$APP_ROOT/ops/scripts/generate-brand-assets.mjs" >/dev/null

render_asset() {
  local source_file="$1"
  local output_file="$2"
  local format="$3"

  mkdir -p "$(dirname "$output_file")"
  sips -s format "$format" "$source_file" --out "$output_file" >/dev/null
}

render_asset "$BRAND_DIR/hero-campus.svg" \
  "$OUTPUT_DIR/wp-content/uploads/2022/07/img-1.jpg" jpeg
render_asset "$BRAND_DIR/program-apoyo-administrativo.svg" \
  "$OUTPUT_DIR/wp-content/uploads/2023/02/apoyo-administrativo_-1024x1024.png" png
render_asset "$BRAND_DIR/program-estilismo.svg" \
  "$OUTPUT_DIR/wp-content/uploads/2023/02/estilismo-1024x1024.png" png
render_asset "$BRAND_DIR/program-patronaje.svg" \
  "$OUTPUT_DIR/wp-content/uploads/2023/02/patronaje-1024x1024.png" png
render_asset "$BRAND_DIR/program-panificacion-industrial.svg" \
  "$OUTPUT_DIR/wp-content/uploads/2023/02/panificacion-industrial-1024x1024.png" png
render_asset "$BRAND_DIR/program-control-almacenamiento.svg" \
  "$OUTPUT_DIR/wp-content/uploads/2023/02/almacenero-1024x1024.png" png
render_asset "$BRAND_DIR/program-programacion-sistemas.svg" \
  "$OUTPUT_DIR/wp-content/uploads/2023/02/programador-1024x1024.png" png
render_asset "$BRAND_DIR/program-mantenimiento-electronico.svg" \
  "$OUTPUT_DIR/wp-content/uploads/2023/02/electricista-1024x1024.png" png

printf '%s\n' "$OUTPUT_DIR"
