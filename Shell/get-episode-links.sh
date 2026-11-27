#!/usr/bin/env bash
#
# get-episode-links.sh
# Save every episode link of a season page into one Markdown file.
#
# Usage:
#   ./get-episode-links.sh [SEASON_URL] [OUTPUT_DIR]
#
#   SEASON_URL  Full URL of the season page. Asked for if you leave it out.
#   OUTPUT_DIR  Where the season folder is created.
#               Default: the folder you run the script from.
#
# Result:
#   <OUTPUT_DIR>/<season-name-from-url>/links.md
#
# Needs: bash, curl, sed, grep, awk (already on macOS and Linux;
#        on Windows use WSL or Git Bash).

set -euo pipefail

url="${1:-}"
out_base="${2:-$PWD}"

# ---- 1. Get and check the URL ------------------------------------------------
if [ -z "$url" ]; then
  read -r -p "Season URL: " url || true
fi
url="$(printf '%s' "$url" | tr -d '[:space:]')"

case "$url" in
  http://*|https://*) ;;
  *)
    echo "Error: please give a full URL that starts with http:// or https://" >&2
    exit 1
    ;;
esac

# ---- 2. Season name = last part of the URL path ------------------------------
path="${url%%[?#]*}"                                  # drop ?query and #fragment
while [ "${path%/}" != "$path" ]; do path="${path%/}"; done   # drop trailing /
rest="${path#*://}"
case "$rest" in
  */*) slug="${rest##*/}" ;;
  *)   slug="$rest" ;;                                # bare domain, no path
esac
# keep it safe as a folder name (no slashes, no leading dots, no .html ending)
slug="$(printf '%s' "$slug" | sed -E -e 's/\.(html?|php|aspx?)$//' -e 's/[^A-Za-z0-9._-]/-/g' -e 's/^[.-]*//')"
[ -n "$slug" ] || slug="season"

# "dragon-booster-season-2-tamil-dubbed" -> "Dragon Booster Season 2 Tamil Dubbed"
title="$(printf '%s' "$slug" | tr '_-' '  ' \
  | awk '{for(i=1;i<=NF;i++) $i=toupper(substr($i,1,1)) substr($i,2)} 1')"

# ---- 3. Download the page ----------------------------------------------------
echo "Fetching $url ..."
html="$(curl -fsSL -m 30 -A "Mozilla/5.0" "$url")" || {
  echo "Error: could not download the page. Check the URL and your connection." >&2
  exit 1
}

# ---- 4. Pull out the links, one per line -------------------------------------
# Preferred: the page's own `downloadLinks = [ ... ]` list. Episode number is the
# position in that list, so a blank entry still counts as an episode.
links="$(printf '%s\n' "$html" \
  | sed -n '/downloadLinks[[:space:]]*=[[:space:]]*\[/,/[]]/p' \
  | grep -oE '"[^"]*"' | sed -e 's/^"//' -e 's/"$//' || true)"
numbered_by="position in the page's episode list"

found="$(printf '%s\n' "$links" | grep -c . || true)"

# Fallback: any Google Drive / Mega link in the page source, in page order.
if [ "$found" -eq 0 ]; then
  links="$(printf '%s\n' "$html" \
    | grep -oE 'https?://(drive\.google\.com|mega\.nz)/[^"\\ <>]+' \
    | awk '!seen[$0]++' || true)"
  numbered_by="order found on the page"
  found="$(printf '%s\n' "$links" | grep -c . || true)"
fi

if [ "$found" -eq 0 ]; then
  echo "Error: no Drive or Mega links found in that page's source." >&2
  echo "       The site may build its links differently. Nothing was saved." >&2
  exit 1
fi

total="$(printf '%s\n' "$links" | wc -l | tr -d ' ')"

# ---- 5. Write <OUTPUT_DIR>/<season>/links.md ---------------------------------
dir="$out_base/$slug"
mkdir -p "$dir"
file="$dir/links.md"

{
  printf '# %s\n\n' "$title"
  printf -- '- Source: %s\n' "$url"
  printf -- '- Saved: %s\n' "$(date '+%Y-%m-%d %H:%M')"
  printf -- '- Episodes: %s (numbered by %s)\n\n' "$total" "$numbered_by"

  n=0
  while IFS= read -r link; do
    n=$((n + 1))
    if [ -n "$link" ]; then
      printf '%s. [Episode %s](%s)\n' "$n" "$n" "$link"
    else
      printf '%s. Episode %s: _no link on the page_\n' "$n" "$n"
    fi
  done <<< "$links"
} > "$file"

echo "Saved $found link(s) to: $file"
if [ "$found" -ne "$total" ]; then
  echo "Note: $((total - found)) episode(s) had no link on the page (marked in the file)."
fi
