#!/usr/bin/env bash
# ==============================================================================
# deploy.sh  —  Firebase Hosting deployment
# ==============================================================================
# Deploys your widget folder and the listing page together.
# The widget's entry (name, URL, status) is written to script.js automatically.
#
# Usage:
#   macOS / Linux:
#     chmod +x deploy.sh   (first time only)
#     ./deploy.sh
#
#   Windows (Git Bash):
#     bash deploy.sh
#
# Pre-requisites:
#   • Node.js      — https://nodejs.org
#   • Firebase CLI — npm install -g firebase-tools
#   • Python       — pre-installed on macOS/Linux; https://python.org on Windows
#                    (script auto-detects python3 / python / py)
# ==============================================================================

# ── Configuration — fill in before first run ──────────────────────────────────
FIREBASE_PROJECT_ID="widgets-c812e"
FIREBASE_HOSTING_SITE_ID="tce-widgets"
FIREBASE_TOKEN=""    # leave empty to use browser login (firebase login)

# ── Load shared library ────────────────────────────────────────────────────────
source "$(dirname "${BASH_SOURCE[0]}")/_deploy-lib.sh"
set -euo pipefail

lib_validate_config
lib_check_tools
lib_auth_check

HOSTING_BASE_URL="https://${FIREBASE_HOSTING_SITE_ID}.web.app"

# ── Creator profile ────────────────────────────────────────────────────────────
CREATOR_NAME=""
CREATOR_INITIALS=""

[[ -f "$CREATOR_PROFILE_FILE" ]] && source "$CREATOR_PROFILE_FILE"

if [[ -n "$CREATOR_NAME" ]]; then
  printf "\n${BOLD}Creator profile:${NC} %s  (initials: %s)\n" \
    "$CREATOR_NAME" "$CREATOR_INITIALS"
  read -rp "  Keep this profile? [Y/n]: " _KEEP
  if [[ "$_KEEP" =~ ^[Nn]$ ]]; then
    CREATOR_NAME=""
    CREATOR_INITIALS=""
  fi
fi

if [[ -z "$CREATOR_NAME" ]]; then
  step "Creator profile"
  while true; do
    read -rp "  Enter your name: " CREATOR_NAME
    CREATOR_NAME="$(echo "$CREATOR_NAME" | xargs)"
    [[ -n "$CREATOR_NAME" ]] && break
    warn "Name cannot be empty."
  done
  CREATOR_INITIALS="$(echo "$CREATOR_NAME" | cut -c1-2 | tr '[:upper:]' '[:lower:]')"
  printf 'CREATOR_NAME="%s"\nCREATOR_INITIALS="%s"\n' \
    "$CREATOR_NAME" "$CREATOR_INITIALS" > "$CREATOR_PROFILE_FILE"
  ok "Profile saved: $CREATOR_NAME ($CREATOR_INITIALS)"
fi

# ── Select widget folder ───────────────────────────────────────────────────────
step "Scanning for widget folders..."
cd "$SCRIPT_DIR"

WIDGET_DIRS=()
for dir in wg*/; do
  [[ -d "$dir" ]] && WIDGET_DIRS+=("${dir%/}")
done
[[ ${#WIDGET_DIRS[@]} -eq 0 ]] && fail "No widget folders (wg*) found."
IFS=$'\n' WIDGET_DIRS=($(printf '%s\n' "${WIDGET_DIRS[@]}" | sort)); unset IFS

printf "\n${BOLD}Available widget folders:${NC}\n"
printf '%s\n' "──────────────────────────────────────────────────────────"
for dir in "${WIDGET_DIRS[@]}"; do
  WG_KEY=$(echo "$dir" | grep -oE '^wg[0-9]+')
  printf "  %-8s  %s\n" "${WG_KEY})" "$dir"
done
printf '%s\n' "──────────────────────────────────────────────────────────"
echo ""

WIDGET_FOLDER=""
while true; do
  read -rp "Enter the wg number to deploy (e.g. 121): " SEL
  SEL="${SEL#[wW][gG]}"
  if [[ "$SEL" =~ ^[0-9]+$ ]]; then
    for dir in "${WIDGET_DIRS[@]}"; do
      if [[ "$dir" =~ ^wg${SEL}(-|$) ]]; then
        WIDGET_FOLDER="$dir"; break
      fi
    done
  fi
  [[ -n "$WIDGET_FOLDER" ]] && break
  warn "No widget folder found for 'wg${SEL}'. Check the list above."
  WIDGET_FOLDER=""
done

WIDGET_URL="${HOSTING_BASE_URL}/${WIDGET_FOLDER}/"
ok "Selected: $WIDGET_FOLDER"
printf "  URL: %s\n" "$WIDGET_URL"

# ── Select widget status ───────────────────────────────────────────────────────
echo ""
printf "${BOLD}Widget status:${NC}\n"
printf "  1) Closed\n  2) Review\n  3) WIP\n  4) Todo\n"
echo ""
WIDGET_STATUS="closed"
while true; do
  read -rp "Select status [1-4, default: 1]: " STATUS_SEL
  STATUS_SEL="${STATUS_SEL:-1}"
  case "$STATUS_SEL" in
    1) WIDGET_STATUS="closed";        ok "Status: Closed";  break ;;
    2) WIDGET_STATUS="in-review";     ok "Status: Review";  break ;;
    3) WIDGET_STATUS="WIP-With-Tech"; ok "Status: WIP";     break ;;
    4) WIDGET_STATUS="todo";          ok "Status: Todo";    break ;;
    *) warn "Enter a number between 1 and 4." ;;
  esac
done

# ── Write Firebase config files ────────────────────────────────────────────────
lib_write_firebase_configs

# ── Update widget entry in script.js ──────────────────────────────────────────
step "Writing widget entry to widget-listing-b3/script/script.js..."

WG_NUM=$(echo "$WIDGET_FOLDER" | grep -oE '[0-9]+' | head -1)
RAW_TITLE=$(echo "$WIDGET_FOLDER" | sed 's/^wg[0-9]*-//' | tr '-' ' ')
WIDGET_TITLE=$(PYTHONIOENCODING=utf-8 $PYTHON -c "print('$RAW_TITLE'.title())")
ASSET_PATH="./assets/wg-${WG_NUM}.png"

export _SCRIPT_JS="$MAIN_SCRIPT_JS"
export _WIDGET_TITLE="$WIDGET_TITLE"
export _WIDGET_URL="$WIDGET_URL"
export _ASSET_PATH="$ASSET_PATH"
export _WG_NUM="$WG_NUM"
export _WIDGET_FOLDER="$WIDGET_FOLDER"
export _CREATOR_INITIALS="$CREATOR_INITIALS"
export _WIDGET_STATUS="$WIDGET_STATUS"

PYTHONIOENCODING=utf-8 $PYTHON << 'PYEOF'
import os, re
from datetime import datetime

script_path      = os.environ['_SCRIPT_JS']
widget_title     = os.environ['_WIDGET_TITLE']
widget_url       = os.environ['_WIDGET_URL']
asset_path       = os.environ['_ASSET_PATH']
wg_num           = os.environ['_WG_NUM']
widget_folder    = os.environ['_WIDGET_FOLDER']
creator_initials = os.environ.get('_CREATOR_INITIALS', '')
widget_status    = os.environ.get('_WIDGET_STATUS', 'closed')
updated_at       = datetime.now().strftime('%Y-%m-%d %H:%M')

new_entry = (
    "    {\n"
    f'        name: "{widget_title}",\n'
    f'        link: "{widget_url}",\n'
    f'        imagePath: "{asset_path}",\n'
    f'        creators: "{creator_initials}-{wg_num}",\n'
    f'        status: "{widget_status}",\n'
    f'        updatedAt: "{updated_at}",\n'
    "    },"
)

with open(script_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Remove any existing entry for this widget (by folder URL or asset image path)
for pattern in [
    r'\n\s*\{[^}]*?' + re.escape(widget_folder) + r'[^}]*?\},?',
    r'\n\s*\{[^}]*?wg-' + re.escape(wg_num) + r'\.png[^}]*?\},?',
]:
    match = re.search(pattern, content, re.DOTALL)
    if match:
        content = content[:match.start()] + content[match.end():]

# Insert fresh entry at the top of WIDGET_DATA
updated = re.sub(
    r'(\[\s*\n)(\s*\{)',
    lambda m: m.group(1) + new_entry + "\n" + m.group(2),
    content, count=1
)
if updated == content:
    idx = content.rfind('},')
    if idx != -1:
        updated = content[:idx + 2] + "\n" + new_entry + content[idx + 2:]

with open(script_path, 'w', encoding='utf-8') as f:
    f.write(updated)
print(f"Written: {widget_title}  [{widget_status}]  →  {widget_url}")
PYEOF

ok "script.js updated."
unset _SCRIPT_JS _WIDGET_TITLE _WIDGET_URL _ASSET_PATH _WG_NUM \
      _WIDGET_FOLDER _CREATOR_INITIALS _WIDGET_STATUS

# ── Build dist/ and deploy ─────────────────────────────────────────────────────
lib_build_dist "$WIDGET_FOLDER"

step "Deploying to Firebase Hosting..."
printf "  Project : %s\n" "$FIREBASE_PROJECT_ID"
printf "  Site    : %s.web.app\n" "$FIREBASE_HOSTING_SITE_ID"
printf "  Widget  : %s\n" "$WIDGET_FOLDER"
echo ""
lib_deploy "$FIREBASE_PROJECT_ID" "${FIREBASE_TOKEN:-}"

printf "\n${GREEN}${BOLD}Done!${NC}\n\n"
printf "  Main site : %s/\n" "$HOSTING_BASE_URL"
printf "  Widget    : %s\n\n" "$WIDGET_URL"
