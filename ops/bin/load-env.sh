#!/usr/bin/env sh
set -eu

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname "$0")" && pwd)
APP_ROOT=${APP_ROOT:-$(CDPATH= cd -- "$SCRIPT_DIR/../.." && pwd)}
APP_ENV_FILE=${APP_ENV_FILE:-${ENV_FILE:-"$APP_ROOT/.env"}}
ENV_FILE=$APP_ENV_FILE

if [ ! -f "$ENV_FILE" ]; then
  printf '%s\n' "Missing env file: $ENV_FILE" >&2
  exit 1
fi

set -a
. "$ENV_FILE"
set +a

export APP_ROOT
export APP_ENV_FILE
export ENV_FILE
