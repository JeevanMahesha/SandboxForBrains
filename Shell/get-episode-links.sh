#!/usr/bin/env bash
#
# get-episode-links.sh
# Save every episode link of a season page into one HTML file.
#
# Usage:
#   ./get-episode-links.sh [SEASON_URL] [OUTPUT_DIR]
#
#   SEASON_URL  Full URL of the season page. Asked for if you leave it out.
#   OUTPUT_DIR  Where the season folder is created.
#               Default: the folder you run the script from.
#
# Result:
#   <OUTPUT_DIR>/<season-name-from-url>/links.html
#   (open it in any browser; every episode is a clickable link)
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
# Only real web links (http/https) count as links.
count_links() { printf '%s\n' "$1" | grep -cE '^https?://' || true; }

# Preferred: the page's own `downloadLinks = [ ... ]` list. Episode number is the
# position in that list, so a blank entry still counts as an episode.
links="$(printf '%s\n' "$html" \
  | sed -n '/downloadLinks[[:space:]]*=[[:space:]]*\[/,/[]]/p' \
  | grep -oE '"[^"]*"' | sed -e 's/^"//' -e 's/"$//' || true)"
numbered_by="position in the page's episode list"
found="$(count_links "$links")"

# Fallback: any Google Drive / Mega link in the page source, in page order.
if [ "$found" -eq 0 ]; then
  links="$(printf '%s\n' "$html" \
    | grep -oE 'https?://(drive\.google\.com|mega\.nz)/[^"\\ <>]+' \
    | awk '!seen[$0]++' || true)"
  numbered_by="order found on the page"
  found="$(count_links "$links")"
fi

if [ "$found" -eq 0 ]; then
  echo "Error: no Drive or Mega links found in that page's source." >&2
  echo "       The site may build its links differently. Nothing was saved." >&2
  exit 1
fi

total="$(printf '%s\n' "$links" | wc -l | tr -d ' ')"

# ---- 5. Write <OUTPUT_DIR>/<season>/links.html -------------------------------
# Everything that came from the web is escaped before it goes into the HTML.
esc() {
  printf '%s' "$1" | sed -e 's/&/\&amp;/g' -e 's/</\&lt;/g' -e 's/>/\&gt;/g' \
    -e 's/"/\&quot;/g' -e "s/'/\&#39;/g"
}

dir="$out_base/$slug"
mkdir -p "$dir"
file="$dir/links.html"

{
  printf '<!doctype html>\n<html lang="en">\n<head>\n'
  printf '<meta charset="utf-8">\n'
  printf '<meta name="viewport" content="width=device-width, initial-scale=1">\n'
  printf '<title>%s</title>\n' "$(esc "$title")"
  cat <<'CSS'
<style>
  :root {
    color-scheme: light dark;
    --bg: #ffffff; --fg: #1b1f24; --muted: #59636e;
    --line: #d8dee4; --card: #f6f8fa; --accent: #0969da;
  }
  @media (prefers-color-scheme: dark) {
    :root {
      --bg: #0d1117; --fg: #e6edf3; --muted: #9198a1;
      --line: #30363d; --card: #161b22; --accent: #58a6ff;
    }
  }
  body {
    margin: 0; background: var(--bg); color: var(--fg);
    font: 16px/1.5 system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  }
  main { max-width: 720px; margin: 0 auto; padding: 32px 16px 48px; }
  h1 { font-size: 1.6rem; line-height: 1.25; margin: 0 0 8px; }
  .meta { color: var(--muted); font-size: 0.9rem; margin: 0 0 24px; }
  .meta a { color: inherit; }
  ol {
    list-style: none; margin: 0; padding: 0;
    border: 1px solid var(--line); border-radius: 10px; overflow: hidden;
  }
  li {
    display: flex; align-items: baseline; gap: 12px; flex-wrap: wrap;
    padding: 12px 16px; background: var(--card); border-top: 1px solid var(--line);
  }
  li:first-child { border-top: 0; }
  .ep { color: var(--accent); font-weight: 600; text-decoration: none; }
  .ep:hover { text-decoration: underline; }
  .url {
    color: var(--muted); font-size: 0.8rem; min-width: 0;
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex: 1;
  }
  .missing { color: var(--muted); }
</style>
CSS
  printf '</head>\n<body>\n<main>\n'
  printf '<h1>%s</h1>\n' "$(esc "$title")"
  printf '<p class="meta">%s episodes &middot; saved %s &middot; <a href="%s">source page</a><br>Numbered by %s.</p>\n' \
    "$total" "$(date '+%Y-%m-%d %H:%M')" "$(esc "$url")" "$(esc "$numbered_by")"
  printf '<ol>\n'

  n=0
  while IFS= read -r link; do
    n=$((n + 1))
    case "$link" in
      http://*|https://*)
        e="$(esc "$link")"
        printf '  <li><a class="ep" href="%s" target="_blank" rel="noopener noreferrer">Episode %s</a><span class="url">%s</span></li>\n' \
          "$e" "$n" "$e"
        ;;
      *)
        printf '  <li class="missing">Episode %s &mdash; no link on the page</li>\n' "$n"
        ;;
    esac
  done <<< "$links"

  printf '</ol>\n</main>\n</body>\n</html>\n'
} > "$file"

echo "Saved $found link(s) to: $file"
if [ "$found" -ne "$total" ]; then
  echo "Note: $((total - found)) episode(s) had no link on the page (marked in the file)."
fi
