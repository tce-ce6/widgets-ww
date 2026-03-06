#!/usr/bin/env bash
# ==============================================================================
# deploy-batch.sh  —  Batch widget deployment
# ==============================================================================
# Deploy multiple widget folders in one go by supplying their widget numbers.
# Each widget's DB entry (name, link, imagePath, creators, status, updatedAt)
# is written to Firebase Realtime Database, then all folders are deployed to
# Firebase Hosting together.
#
# Usage:
#   macOS / Linux:
#     chmod +x deploy-batch.sh          (first time only)
#     ./deploy-batch.sh                 (prompts for numbers)
#     ./deploy-batch.sh 104 112 121     (pass numbers directly)
#     ./deploy-batch.sh wg104 wg112     (wg-prefix also accepted)
#
#   Windows (Git Bash):
#     bash deploy-batch.sh
#     bash deploy-batch.sh 104 112 121
#
# Pre-requisites:
#   • Node.js      — https://nodejs.org
#   • Firebase CLI — npm install -g firebase-tools
#   • Python       — pre-installed on macOS/Linux; https://python.org on Windows
# ==============================================================================

# ── Configuration ──────────────────────────────────────────────────────────────
FIREBASE_PROJECT_ID="widgets-c812e"
FIREBASE_HOSTING_SITE_ID="tce-widgets"
FIREBASE_TOKEN=""    # leave empty to use browser login (firebase login)

# ── Load shared library ────────────────────────────────────────────────────────
source "$(dirname "${BASH_SOURCE[0]}")/_deploy-lib.sh"
set -euo pipefail

lib_validate_config
lib_check_tools
lib_auth_check
lib_validate_script_js

HOSTING_BASE_URL="https://${FIREBASE_HOSTING_SITE_ID}.web.app"
cd "$SCRIPT_DIR"

# ── Build local widget folder index ───────────────────────────────────────────
ALL_WIDGET_DIRS=()
for dir in wg*/; do
  [[ -d "$dir" ]] && ALL_WIDGET_DIRS+=("${dir%/}")
done
[[ ${#ALL_WIDGET_DIRS[@]} -eq 0 ]] && fail "No widget folders (wg*) found."
IFS=$'\n' ALL_WIDGET_DIRS=($(printf '%s\n' "${ALL_WIDGET_DIRS[@]}" | sort)); unset IFS

# Helper: resolve a widget number → folder name
resolve_folder() {
  local num="${1#[wW][gG]}"   # strip optional wg prefix
  num="${num%/}"
  for dir in "${ALL_WIDGET_DIRS[@]}"; do
    if [[ "$dir" =~ ^wg${num}(-|$) ]]; then
      echo "$dir"; return 0
    fi
  done
  return 1
}

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

# ── Collect widget numbers ─────────────────────────────────────────────────────
step "Selecting widgets..."

# Print the full folder list for reference
printf "\n${BOLD}Available widget folders:${NC}\n"
printf '%s\n' "──────────────────────────────────────────────────────────"
for dir in "${ALL_WIDGET_DIRS[@]}"; do
  WG_KEY=$(echo "$dir" | grep -oE '^wg[0-9]+')
  printf "  %-8s  %s\n" "${WG_KEY})" "$dir"
done
printf '%s\n' "──────────────────────────────────────────────────────────"
echo ""

INPUT_NUMS=()
if [[ $# -gt 0 ]]; then
  # Numbers passed as command-line arguments
  for arg in "$@"; do
    INPUT_NUMS+=("$arg")
  done
  printf "  Using numbers from arguments: %s\n" "${INPUT_NUMS[*]}"
else
  # Interactive prompt
  while true; do
    read -rp "Enter widget numbers separated by spaces (e.g. 104 112 121): " RAW_INPUT
    RAW_INPUT="$(echo "$RAW_INPUT" | xargs)"
    [[ -n "$RAW_INPUT" ]] && break
    warn "Please enter at least one widget number."
  done
  read -ra INPUT_NUMS <<< "$RAW_INPUT"
fi

# Resolve numbers → folders, report unknowns
SELECTED_FOLDERS=()
NOT_FOUND=()
for num in "${INPUT_NUMS[@]}"; do
  folder=$(resolve_folder "$num") && SELECTED_FOLDERS+=("$folder") \
    || NOT_FOUND+=("$num")
done

if [[ ${#NOT_FOUND[@]} -gt 0 ]]; then
  warn "The following numbers were not found locally and will be skipped:"
  for n in "${NOT_FOUND[@]}"; do printf "    - wg%s\n" "${n#[wW][gG]}"; done
fi

[[ ${#SELECTED_FOLDERS[@]} -eq 0 ]] && fail "No valid widget folders found. Exiting."

printf "\n  ${BOLD}Widgets selected (%s):${NC}\n" "${#SELECTED_FOLDERS[@]}"
for f in "${SELECTED_FOLDERS[@]}"; do
  printf "    • %s\n" "$f"
done
echo ""

# ── Status selection ───────────────────────────────────────────────────────────
printf "${BOLD}Widget status:${NC}\n"
printf "  1) Closed\n  2) Review\n  3) WIP\n  4) Todo\n"
printf "  p) Set per widget\n\n"

GLOBAL_STATUS=""
while true; do
  read -rp "Select status for all [1-4/p, default: 1]: " STATUS_SEL
  STATUS_SEL="${STATUS_SEL:-1}"
  case "$STATUS_SEL" in
    1) GLOBAL_STATUS="closed";        ok "All → Closed";  break ;;
    2) GLOBAL_STATUS="in-review";     ok "All → Review";  break ;;
    3) GLOBAL_STATUS="WIP-With-Tech"; ok "All → WIP";     break ;;
    4) GLOBAL_STATUS="todo";          ok "All → Todo";    break ;;
    [pP]) GLOBAL_STATUS="per-widget"; break ;;
    *) warn "Enter a number between 1-4, or 'p' for per-widget." ;;
  esac
done

# Build a parallel status array (same index as SELECTED_FOLDERS — Bash 3.2 safe)
SELECTED_STATUSES=()
if [[ "$GLOBAL_STATUS" == "per-widget" ]]; then
  for folder in "${SELECTED_FOLDERS[@]}"; do
    printf "\n  ${BOLD}%s${NC}\n" "$folder"
    printf "  1) Closed  2) Review  3) WIP  4) Todo\n"
    while true; do
      read -rp "  Status [1-4, default: 1]: " PS
      PS="${PS:-1}"
      case "$PS" in
        1) SELECTED_STATUSES+=("closed");        ok "$folder → Closed"; break ;;
        2) SELECTED_STATUSES+=("in-review");     ok "$folder → Review"; break ;;
        3) SELECTED_STATUSES+=("WIP-With-Tech"); ok "$folder → WIP";    break ;;
        4) SELECTED_STATUSES+=("todo");          ok "$folder → Todo";   break ;;
        *) warn "Enter 1-4." ;;
      esac
    done
  done
else
  for folder in "${SELECTED_FOLDERS[@]}"; do
    SELECTED_STATUSES+=("$GLOBAL_STATUS")
  done
fi

# ── Confirmation ───────────────────────────────────────────────────────────────
printf "\n${BOLD}Summary:${NC}\n"
printf '%s\n' "──────────────────────────────────────────────────────────"
printf "  %-42s  %s\n" "Folder" "Status"
printf '%s\n' "──────────────────────────────────────────────────────────"
for i in "${!SELECTED_FOLDERS[@]}"; do
  printf "  %-42s  %s\n" "${SELECTED_FOLDERS[$i]}" "${SELECTED_STATUSES[$i]}"
done
printf '%s\n' "──────────────────────────────────────────────────────────"
printf "  Creator: %s (%s)\n\n" "$CREATOR_NAME" "$CREATOR_INITIALS"

read -rp "  Proceed with DB update and deployment? [Y/n]: " CONFIRM
if [[ "$CONFIRM" =~ ^[Nn]$ ]]; then
  printf "\n  Aborted.\n\n"; exit 0
fi

# ── Write Firebase config files ────────────────────────────────────────────────
lib_write_firebase_configs

# ── Update Realtime Database for each widget ───────────────────────────────────
step "Updating Firebase Realtime Database..."

for i in "${!SELECTED_FOLDERS[@]}"; do
  WIDGET_FOLDER="${SELECTED_FOLDERS[$i]}"
  WIDGET_STATUS="${SELECTED_STATUSES[$i]}"
  WG_NUM=$(echo "$WIDGET_FOLDER" | grep -oE '[0-9]+' | head -1)
  RAW_TITLE=$(echo "$WIDGET_FOLDER" | sed 's/^wg[0-9]*-//' | tr '-' ' ')
  WIDGET_TITLE=$(PYTHONIOENCODING=utf-8 $PYTHON -c "print('$RAW_TITLE'.title())")
  WIDGET_URL="${HOSTING_BASE_URL}/${WIDGET_FOLDER}/"

  DB_JSON=$(PYTHONIOENCODING=utf-8 $PYTHON -c "
import json
from datetime import datetime
entry = {
    'name':      '${WIDGET_TITLE}',
    'link':      '${WIDGET_URL}',
    'imagePath': './assets/wg-${WG_NUM}.png',
    'creators':  '${CREATOR_INITIALS}-${WG_NUM}',
    'status':    '${WIDGET_STATUS}',
    'updatedAt': datetime.now().strftime('%Y-%m-%d %H:%M'),
}
print(json.dumps(entry))
")

  firebase database:update "/widgets/wg${WG_NUM}" \
    --data "$DB_JSON" \
    --project "$FIREBASE_PROJECT_ID" \
    --force 2>&1 | grep -v "^$" || true

  ok "DB updated: wg${WG_NUM}  [${WIDGET_STATUS}]  ${WIDGET_TITLE}"
done

# ── Build dist/ and deploy ─────────────────────────────────────────────────────
# All batch widgets are now in the DB, so lib_build_dist (querying the DB)
# will automatically include all of them alongside previously deployed widgets.
lib_build_dist ""

step "Deploying to Firebase Hosting..."
printf "  Project : %s\n" "$FIREBASE_PROJECT_ID"
printf "  Site    : %s.web.app\n" "$FIREBASE_HOSTING_SITE_ID"
printf "  Widgets : %s\n" "${#SELECTED_FOLDERS[@]}"
echo ""
lib_deploy "$FIREBASE_PROJECT_ID" "${FIREBASE_TOKEN:-}"

printf "\n${GREEN}${BOLD}Done!${NC}\n\n"
printf "  Main site : %s/\n" "$HOSTING_BASE_URL"
printf "  Deployed  :\n"
for WIDGET_FOLDER in "${SELECTED_FOLDERS[@]}"; do
  printf "    %s/%s/\n" "$HOSTING_BASE_URL" "$WIDGET_FOLDER"
done
printf "\n"
