#!/usr/bin/env bash
# ==============================================================================
# _deploy-lib.sh  —  shared library for deploy scripts
# Do NOT run this file directly. It is sourced by the deploy scripts.
# ==============================================================================

# ── Internal paths ─────────────────────────────────────────────────────────────
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[1]}")" && pwd)"
LISTING_DIR="$SCRIPT_DIR/widget-listing-b3"
DATA_DIR="$LISTING_DIR/data"
MANIFEST_FILE="$DATA_DIR/widgets.json"

# ── Colours ────────────────────────────────────────────────────────────────────
if [[ -t 1 ]]; then
  RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'
  BLUE='\033[0;34m'; BOLD='\033[1m'; NC='\033[0m'
else
  RED=''; GREEN=''; YELLOW=''; BLUE=''; BOLD=''; NC=''
fi

step() { printf "\n${BLUE}==>$NC %s\n" "$1"; }
ok()   { printf "${GREEN}✓$NC %s\n" "$1"; }
warn() { printf "${YELLOW}⚠$NC  %s\n" "$1"; }
fail() { printf "${RED}✗$NC  %s\n" "$1" >&2; exit 1; }

# ── Validate config ────────────────────────────────────────────────────────────
lib_validate_config() {
  if [[ "${GITHUB_PAGES_BASE_URL:-}" == "YOUR_GITHUB_PAGES_URL" || -z "${GITHUB_PAGES_BASE_URL:-}" ]]; then
    fail "GITHUB_PAGES_BASE_URL is not set in the deploy script."
  fi
}

# ── Detect Python ──────────────────────────────────────────────────────────────
lib_detect_python() {
  if   command -v python3 &>/dev/null; then PYTHON=python3
  elif command -v python  &>/dev/null; then PYTHON=python
  elif command -v py      &>/dev/null; then PYTHON=py
  else fail "Python is required but was not found. Install from https://python.org"
  fi
}

# ── Check required tools ───────────────────────────────────────────────────────
lib_check_tools() {
  command -v git &>/dev/null || fail "git is not installed."
  lib_detect_python
}

# ── Validate listing-page script.js has the correct DATA_URL ──────────────────
# Catches the merge-conflict regression where an old branch's static
# WIDGET_DATA array or Firebase DB_URL replaces the correct script.js.
lib_validate_script_js() {
  local js_file="$LISTING_DIR/script/script.js"
  if ! grep -q 'const DATA_URL' "$js_file" 2>/dev/null; then
    fail "widget-listing-b3/script/script.js is missing 'const DATA_URL'.
  Your branch has an old or Firebase-based version of the file.
  Fix with:
    git checkout origin/deploy -- widget-listing-b3/script/script.js
  Then re-run the deploy script."
  fi
  if grep -q 'const WIDGET_DATA\s*=' "$js_file" 2>/dev/null; then
    fail "widget-listing-b3/script/script.js still contains a static 'const WIDGET_DATA' array.
  Fix with:
    git checkout origin/deploy -- widget-listing-b3/script/script.js
  Then re-run the deploy script."
  fi
}

# ── Resolve git username ────────────────────────────────────────────────────────
lib_get_git_username() {
  GIT_USERNAME="$(git config user.name 2>/dev/null | xargs)"
  if [[ -z "$GIT_USERNAME" ]]; then
    GIT_USERNAME="$(git config user.email 2>/dev/null | cut -d@ -f1 | xargs)"
  fi
}

# ── Write a widget's widget.json ───────────────────────────────────────────────
# Usage: lib_write_widget_json <folder> <title> <url> <creator> <status>
lib_write_widget_json() {
  local folder="$1" title="$2" url="$3" creator="$4" status="$5"
  local wg_num
  wg_num=$(echo "$folder" | grep -oE '[0-9]+' | head -1)

  PYTHONIOENCODING=utf-8 $PYTHON -c "
import json
from datetime import datetime
entry = {
    'name':      '${title}',
    'link':      '${url}',
    'imagePath': './assets/wg-${wg_num}.png',
    'creators':  '${creator}',
    'status':    '${status}',
    'updatedAt': datetime.now().strftime('%Y-%m-%d %H:%M'),
}
with open('${SCRIPT_DIR}/${folder}/widget.json', 'w', encoding='utf-8') as f:
    json.dump(entry, f, ensure_ascii=False, indent=2)
    f.write('\n')
print(json.dumps(entry, ensure_ascii=False))
"
}

# ── Rebuild widget-listing-b3/data/widgets.json from all wg*/widget.json ──────
lib_build_manifest() {
  step "Rebuilding widget manifest..."
  mkdir -p "$DATA_DIR"

  PYTHONIOENCODING=utf-8 $PYTHON - "$SCRIPT_DIR" "$MANIFEST_FILE" << 'PYEOF'
import sys, os, json

script_dir    = sys.argv[1]
manifest_file = sys.argv[2]

widgets = []
for entry in sorted(os.listdir(script_dir)):
    if not entry.startswith('wg'):
        continue
    json_path = os.path.join(script_dir, entry, 'widget.json')
    if not os.path.isfile(json_path):
        continue
    try:
        with open(json_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        widgets.append(data)
    except Exception as e:
        print(f"  (warning: skipped {json_path} — {e})")

os.makedirs(os.path.dirname(manifest_file), exist_ok=True)
with open(manifest_file, 'w', encoding='utf-8') as f:
    json.dump(widgets, f, ensure_ascii=False, indent=2)
    f.write('\n')

print(f"  {len(widgets)} widget(s) → widget-listing-b3/data/widgets.json")
PYEOF

  ok "Manifest rebuilt."
}

# ── Print next-step git instructions ──────────────────────────────────────────
lib_show_next_steps() {
  local branch
  branch=$(git branch --show-current 2>/dev/null || echo "<your-branch>")
  printf "\n${BOLD}Next steps — commit and push to trigger GitHub Pages:${NC}\n\n"
  printf "  git add .\n"
  printf "  git commit -m \"deploy: <your message>\"\n"
  printf "  git push origin %s\n" "$branch"
  printf "\n  Then open a PR to merge into 'deploy' (or run ./pr.sh)\n\n"
}
