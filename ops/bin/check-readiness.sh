#!/usr/bin/env sh
set -eu

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname "$0")" && pwd)
. "$SCRIPT_DIR/load-env.sh"

readiness_target=${READINESS_TARGET:-internal}

first_origin() {
  printf '%s' "${WEB_ORIGIN:-}" | cut -d ',' -f 1 | tr -d ' '
}

if [ "$readiness_target" = "public" ]; then
  public_origin=${PUBLIC_WEB_ORIGIN:-$(first_origin)}
  next_public_api_url=${NEXT_PUBLIC_API_URL%/}

  if [ -z "$public_origin" ] || [ -z "$next_public_api_url" ]; then
    printf '%s\n' "WEB_ORIGIN and NEXT_PUBLIC_API_URL are required for public readiness." >&2
    exit 1
  fi

  api_url=${API_READINESS_URL:-"$next_public_api_url/health/ready"}
  web_url=${WEB_READINESS_URL:-"$public_origin/"}
else
  api_url=${API_READINESS_URL:-"http://${API_HOST:-127.0.0.1}:${API_PORT:-4010}/api/health/ready"}
  web_url=${WEB_READINESS_URL:-"http://${WEB_HOST:-127.0.0.1}:${WEB_PORT:-3010}/"}
fi

curl -fsS "$api_url" > /dev/null
curl -fsSI "$web_url" > /dev/null

if [ -n "${MEDIA_SMOKE_TEST_URL:-}" ]; then
  curl -fsSI "$MEDIA_SMOKE_TEST_URL" > /dev/null
fi

printf '%s\n' "Readiness checks passed"
