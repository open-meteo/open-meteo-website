#!/usr/bin/env bash
# Convert a photo into a hero/background image matching the existing files in
# static/images/backgrounds: 1200px wide WebP, metadata stripped.
#
# Usage: scripts/create_hero_image.sh <input> <name> [options]
#
#   <input>        source photo (jpg/png/...)
#   <name>         output name -> static/images/backgrounds/<name>.webp
#   --aspect W:H   crop to this aspect ratio (default 2:1, "none" keeps the
#                  input aspect)
#   --focus N      center of the crop window as a percentage along the
#                  cropped axis (default 50 = centered)
#   --quality N    WebP quality (default 80)
#   --width N      output width (default 1200)
#
# Requires ImageMagick 7 (magick).

set -euo pipefail

usage() {
	grep '^#' "$0" | sed 's/^# \{0,1\}//' | tail -n +2
	exit 1
}

[[ $# -lt 2 ]] && usage

input=$1
name=$2
shift 2

aspect="2:1"
focus=50
quality=80
width=1200

while [[ $# -gt 0 ]]; do
	case $1 in
		--aspect) aspect=$2; shift 2 ;;
		--focus) focus=$2; shift 2 ;;
		--quality) quality=$2; shift 2 ;;
		--width) width=$2; shift 2 ;;
		*) echo "Unknown option: $1" >&2; usage ;;
	esac
done

[[ -f $input ]] || { echo "Input not found: $input" >&2; exit 1; }

outdir=$(dirname "$0")/../static/images/backgrounds
out=$outdir/$name.webp

crop_args=()
if [[ $aspect != "none" ]]; then
	[[ $aspect =~ ^[0-9]+:[0-9]+$ ]] || { echo "Invalid aspect: $aspect (expected W:H)" >&2; exit 1; }
	# Dimensions after EXIF orientation is applied.
	dims=$(magick "$input" -auto-orient -format '%w %h' info:)
	w=${dims% *}
	h=${dims#* }
	geometry=$(awk -v w="$w" -v h="$h" -v aspect="$aspect" -v focus="$focus" '
		BEGIN {
			split(aspect, a, ":")
			ratio = a[1] / a[2]
			if (w / h > ratio) {
				ch = h; cw = int(h * ratio + 0.5)
				x = int(w * focus / 100 - cw / 2 + 0.5); y = 0
				if (x < 0) x = 0; if (x > w - cw) x = w - cw
			} else {
				cw = w; ch = int(w / ratio + 0.5)
				y = int(h * focus / 100 - ch / 2 + 0.5); x = 0
				if (y < 0) y = 0; if (y > h - ch) y = h - ch
			}
			printf "%dx%d+%d+%d", cw, ch, x, y
		}')
	crop_args=(-crop "$geometry" +repage)
fi

magick "$input" -auto-orient "${crop_args[@]}" -resize "${width}x" -strip -quality "$quality" "$out"

identify -format "$out: %wx%h, %b\n" "$out"
