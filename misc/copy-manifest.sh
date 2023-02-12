#!/bin/bash
set -eu -o pipefail

mkdir -p dist
jq 'del(.["$schema"])' < src/dev/manifest.production.json > dist/manifest.json
