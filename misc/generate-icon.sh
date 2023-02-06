#!/bin/bash

# generate png icons with different sizes using https://remixicon.com/
# usage:
#   bash misc/generate-icon.sh

icon_name="${1:-"folder-4-line"}"
icon_svg=$(jq -r '.icons."'"$icon_name"'".body' < node_modules/@iconify-json/ri/icons.json)

mkdir -p src/dev/assets
for px in 16 32 48 128; do
  echo '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">'"$icon_svg"'</svg>' \
  | convert -density 1000 -resize "${px}x${px}" -background none svg:- "src/dev/assets/icon-${px}.png"
done
