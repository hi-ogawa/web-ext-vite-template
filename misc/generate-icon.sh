#!/bin/bash
set -eu -o pipefail

# generate png icons with different sizes using https://remixicon.com/
# usage:
#   bash misc/generate-icon.sh folder-4-fill src/dev/assets
#   bash misc/generate-icon.sh folder-4-line src/dev/assets/production

icon_name="$1"
out_dir="$2"

icon_svg=$(jq -r '.icons."'"$icon_name"'".body' < node_modules/@iconify-json/ri/icons.json)

mkdir -p "$out_dir"

echo '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">'"$icon_svg"'</svg>' > "$out_dir/icon.svg"

for px in 16 32 48 128; do
  convert -density 1000 -resize "${px}x${px}" -background none "$out_dir/icon.svg" "$out_dir/icon-${px}.png"
done
