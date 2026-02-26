#!/usr/bin/env bash
# ==============================================================================
# Firebase Hosting Deployment Script
# ==============================================================================
#
# SETUP (one-time):
#   1. Fill in the three REQUIRED configuration values below.
#   2. Make the script executable:
#        chmod +x deploy.sh
#   3. Run it:
#        ./deploy.sh
#
# CREDENTIALS REQUIRED:
#   FIREBASE_PROJECT_ID      — Your Firebase project ID.
#                              Found in: Firebase Console → Project Settings → General
#
#   FIREBASE_HOSTING_SITE_ID — Your Hosting site ID (the subdomain of your .web.app URL).
#                              e.g. if your site is "my-widgets.web.app" → use "my-widgets"
#                              Found in: Firebase Console → Hosting → Dashboard
#
#   FIREBASE_TOKEN           — (Optional) A non-interactive CI token.
#                              Generate one with:  firebase login:ci
#                              Leave empty ("") to use an interactive browser login instead.
#
# PRE-REQUISITES:
#   • Node.js  — https://nodejs.org
#   • Firebase CLI — npm install -g firebase-tools
#   • python3  — pre-installed on macOS
# ==============================================================================

# ── Required configuration — fill in before first run ──────────────────────────

FIREBASE_PROJECT_ID="widgets-c812e"
FIREBASE_HOSTING_SITE_ID="tce-widgets"
FIREBASE_TOKEN=""          # Leave empty to use interactive login (firebase login)

# ==============================================================================
# Internal — no changes needed below this line
# ==============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MAIN_SCRIPT_JS="$SCRIPT_DIR/widget-listing-b3/script/script.js"
FIREBASE_JSON="$SCRIPT_DIR/firebase.json"
FIREBASERC="$SCRIPT_DIR/.firebaserc"

# Colours (disabled when not writing to a terminal)
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

# ── Validate configuration ─────────────────────────────────────────────────────
[[ "$FIREBASE_PROJECT_ID"      == "YOUR_PROJECT_ID"      ]] && \
  fail "FIREBASE_PROJECT_ID is not set. Edit deploy.sh and fill in your project ID."
[[ "$FIREBASE_HOSTING_SITE_ID" == "YOUR_HOSTING_SITE_ID" ]] && \
  fail "FIREBASE_HOSTING_SITE_ID is not set. Edit deploy.sh and fill in your site ID."

# ── Check required tools ───────────────────────────────────────────────────────
command -v firebase &>/dev/null || \
  fail "Firebase CLI not found. Install it with: npm install -g firebase-tools"

# Detect Python — macOS/Linux uses `python3`, Windows Git Bash may only have `python`
if   command -v python3 &>/dev/null; then PYTHON=python3
elif command -v python  &>/dev/null; then PYTHON=python
else fail "Python is required but was not found. Install from https://python.org"
fi

# ── Creator profile ────────────────────────────────────────────────────────────
# Stored locally in .creator_profile (gitignored) so the prompt only runs once.
CREATOR_PROFILE_FILE="$SCRIPT_DIR/.creator_profile"
CREATOR_NAME=""
CREATOR_INITIALS=""

if [[ -f "$CREATOR_PROFILE_FILE" ]]; then
  # shellcheck source=/dev/null
  source "$CREATOR_PROFILE_FILE"
fi

if [[ -n "$CREATOR_NAME" ]]; then
  printf "\n${BOLD}Creator profile:${NC} %s  (initials: %s)\n" "$CREATOR_NAME" "$CREATOR_INITIALS"
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
    CREATOR_NAME="$(echo "$CREATOR_NAME" | xargs)"   # trim whitespace
    [[ -n "$CREATOR_NAME" ]] && break
    warn "Name cannot be empty."
  done
  CREATOR_INITIALS="$(echo "$CREATOR_NAME" | cut -c1-2 | tr '[:upper:]' '[:lower:]')"
  printf 'CREATOR_NAME="%s"\nCREATOR_INITIALS="%s"\n' \
    "$CREATOR_NAME" "$CREATOR_INITIALS" > "$CREATOR_PROFILE_FILE"
  ok "Profile saved: $CREATOR_NAME ($CREATOR_INITIALS)"
fi

# ── Ensure Firebase CLI is authenticated ──────────────────────────────────────
if [[ -z "$FIREBASE_TOKEN" ]]; then
  LOGGED_IN_ACCOUNTS=$(firebase login:list 2>/dev/null | grep -c "@" || true)
  if [[ "$LOGGED_IN_ACCOUNTS" -eq 0 ]]; then
    step "No Firebase account found. Opening browser login..."
    firebase login
  else
    ok "Firebase already authenticated."
  fi
fi

# ── Discover widget folders ────────────────────────────────────────────────────
step "Scanning for widget folders..."
cd "$SCRIPT_DIR"

WIDGET_DIRS=()
for dir in wg*/; do
  [[ -d "$dir" ]] && WIDGET_DIRS+=("${dir%/}")
done

[[ ${#WIDGET_DIRS[@]} -eq 0 ]] && fail "No widget folders (wg*) found in $SCRIPT_DIR"

# Sort alphabetically
IFS=$'\n' WIDGET_DIRS=($(printf '%s\n' "${WIDGET_DIRS[@]}" | sort)); unset IFS

# ── Present selection menu ─────────────────────────────────────────────────────
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
  # Accept input with or without the "wg" prefix
  SEL="${SEL#[wW][gG]}"
  if [[ "$SEL" =~ ^[0-9]+$ ]]; then
    for dir in "${WIDGET_DIRS[@]}"; do
      if [[ "$dir" =~ ^wg${SEL}(-|$) ]]; then
        WIDGET_FOLDER="$dir"
        break
      fi
    done
  fi
  [[ -n "$WIDGET_FOLDER" ]] && break
  warn "No widget folder found for 'wg${SEL}'. Check the list above."
  WIDGET_FOLDER=""
done

HOSTING_BASE_URL="https://${FIREBASE_HOSTING_SITE_ID}.web.app"
WIDGET_URL="${HOSTING_BASE_URL}/${WIDGET_FOLDER}/"

ok "Selected: $WIDGET_FOLDER"
printf "  Will be hosted at: %s\n" "$WIDGET_URL"

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
    1) WIDGET_STATUS="closed";       ok "Status: Closed";       break ;;
    2) WIDGET_STATUS="in-review";    ok "Status: Review";       break ;;
    3) WIDGET_STATUS="WIP-With-Tech"; ok "Status: WIP";          break ;;
    4) WIDGET_STATUS="todo";         ok "Status: Todo";         break ;;
    *) warn "Enter a number between 1 and 4." ;;
  esac
done

# ── Write firebase.json ────────────────────────────────────────────────────────
step "Writing firebase.json..."
cat > "$FIREBASE_JSON" << FIREBASE_JSON_EOF
{
  "hosting": {
    "site": "${FIREBASE_HOSTING_SITE_ID}",
    "public": ".",
    "ignore": [
      "firebase.json",
      ".firebaserc",
      ".creator_profile",
      "deploy.sh",
      ".git/**",
      ".github/**",
      ".gitignore",
      "**/.DS_Store",
      "**/node_modules/**",
      "**/.vscode/**",
      "**/PROMPT.md",
      "**/README.md",
      "**/TODO.md",
      "**/NOTES.md",
      "docs/**"
    ],
    "rewrites": [
      { "source": "/", "destination": "/widget-listing-b3/index.html" }
    ]
  }
}
FIREBASE_JSON_EOF
ok "firebase.json written."

# ── Write .firebaserc ──────────────────────────────────────────────────────────
cat > "$FIREBASERC" << FIREBASERC_EOF
{
  "projects": {
    "default": "${FIREBASE_PROJECT_ID}"
  }
}
FIREBASERC_EOF
ok ".firebaserc written."

# ── Inject (or update) widget link in widget-listing-b3/script/script.js ───────
if [[ ! -f "$MAIN_SCRIPT_JS" ]]; then
  warn "Cannot find $MAIN_SCRIPT_JS — skipping link injection."
else
  step "Writing widget entry to widget-listing-b3/script/script.js..."

  WG_NUM=$(echo "$WIDGET_FOLDER" | grep -oE '[0-9]+' | head -1)
  RAW_TITLE=$(echo "$WIDGET_FOLDER" | sed 's/^wg[0-9]*-//' | tr '-' ' ')
  WIDGET_TITLE=$($PYTHON -c "print('$RAW_TITLE'.title())")
  ASSET_PATH="./assets/wg-${WG_NUM}.png"

  export _SCRIPT_JS="$MAIN_SCRIPT_JS"
  export _WIDGET_TITLE="$WIDGET_TITLE"
  export _WIDGET_URL="$WIDGET_URL"
  export _ASSET_PATH="$ASSET_PATH"
  export _WG_NUM="$WG_NUM"
  export _WIDGET_FOLDER="$WIDGET_FOLDER"
  export _CREATOR_INITIALS="$CREATOR_INITIALS"
  export _WIDGET_STATUS="$WIDGET_STATUS"

  $PYTHON << 'PYEOF'
import os, re

script_path      = os.environ['_SCRIPT_JS']
widget_title     = os.environ['_WIDGET_TITLE']
widget_url       = os.environ['_WIDGET_URL']
asset_path       = os.environ['_ASSET_PATH']
wg_num           = os.environ['_WG_NUM']
widget_folder    = os.environ['_WIDGET_FOLDER']
creator_initials = os.environ.get('_CREATOR_INITIALS', '')
widget_status    = os.environ.get('_WIDGET_STATUS', 'closed')

new_entry = (
    "    {\n"
    f'        name: "{widget_title}",\n'
    f'        link: "{widget_url}",\n'
    f'        imagePath: "{asset_path}",\n'
    f'        creators: "{creator_initials}-{wg_num}",\n'
    f'        status: "{widget_status}",\n'
    "    },"
)

with open(script_path, 'r') as f:
    content = f.read()

# Remove any existing entries that reference this widget (by folder name OR wg number)
# This catches both new-style entries (folder name in link) and old placeholder entries
# (wg number in imagePath like ./assets/wg-85.png)
patterns = [
    (r'\n\s*\{[^}]*?' + re.escape(widget_folder) + r'[^}]*?\},?', f'folder:{widget_folder}'),
    (r'\n\s*\{[^}]*?wg-' + re.escape(wg_num) + r'\.png[^}]*?\},?', f'asset:wg-{wg_num}.png'),
]
for pattern, label in patterns:
    match = re.search(pattern, content, re.DOTALL)
    if match:
        content = content[:match.start()] + content[match.end():]
        print(f"Removed existing entry ({label})")

# Insert the fresh entry as the first item in the WIDGET_DATA array
updated = re.sub(
    r'(\[\s*\n)(\s*\{)',
    lambda m: m.group(1) + new_entry + "\n" + m.group(2),
    content,
    count=1
)

if updated == content:
    # Fallback: append after the last "},"
    idx = content.rfind('},')
    if idx != -1:
        updated = content[:idx + 2] + "\n" + new_entry + content[idx + 2:]
        print("Note: Used fallback insertion (appended after last entry).")
    else:
        print("Warning: Could not find an insertion point. script.js was not modified.")

if updated != content:
    with open(script_path, 'w') as f:
        f.write(updated)
    print(f"Written: {widget_title}")
    print(f"   Link: {widget_url}")
PYEOF

  ok "Widget entry written to script.js"

  unset _SCRIPT_JS _WIDGET_TITLE _WIDGET_URL _ASSET_PATH _WG_NUM _WIDGET_FOLDER _CREATOR_INITIALS _WIDGET_STATUS
fi

# ── Deploy to Firebase Hosting ─────────────────────────────────────────────────
step "Deploying to Firebase Hosting..."
printf "  Project : %s\n" "$FIREBASE_PROJECT_ID"
printf "  Site    : %s.web.app\n" "$FIREBASE_HOSTING_SITE_ID"
printf "  Widget  : %s\n" "$WIDGET_FOLDER"
echo ""

DEPLOY_ARGS=(deploy --only hosting --project "$FIREBASE_PROJECT_ID")
[[ -n "$FIREBASE_TOKEN" ]] && DEPLOY_ARGS+=(--token "$FIREBASE_TOKEN")

if ! firebase "${DEPLOY_ARGS[@]}"; then
  echo ""
  warn "Deployment failed."
  warn "If you saw a 401 error, your login token may be expired. Fix it with:"
  printf "      firebase login --reauth\n"
  printf "  Then re-run this script.\n"
  exit 1
fi

# ── Summary ────────────────────────────────────────────────────────────────────
echo ""
printf "${GREEN}${BOLD}Deployment complete!${NC}\n\n"
printf "  Main site : %s/\n"          "$HOSTING_BASE_URL"
printf "  Widget    : %s\n"           "$WIDGET_URL"
printf "\n"
