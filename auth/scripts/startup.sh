#!/usr/bin/env bash

set -x
set -eo pipefail

if [ -f .env ]; then
    export $(grep -v '^#' .env | xargs)
else
    echo >&2 ".env file is missing."
    echo >&2 "Copy .env.example to .env and adjust the values."
    exit 1
fi

if ! [ -x "$(command -v bunyan)" ]; then
    echo >&2 "Error: bunyan is not installed."
    echo >&2 "Use:"
    echo >&2 "    npm install -g bunyan"
    exit 1
fi

cargo run | bunyan
