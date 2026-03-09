#!/usr/bin/env bash
# ==============================================================================
# deploy-batch.sh  —  Register multiple widgets at once
# ==============================================================================
# Writes widget.json for each chosen widget folder, then rebuilds the manifest.
# GitHub Pages publishes automatically when changes are pushed to 'deploy'.
#
# Usage:
#   ./deploy-batch.sh                  (prompts for numbers)
#   ./deploy-batch.sh 104 112 121      (pass numbers directly)
#   ./deploy-batch.sh wg104 wg112      (wg-prefix also accepted)
#
#   Windows (Git Bash):  bash deploy-batch.sh [numbers...]
# ==============================================================================

# ── Configuration ──────────────────────────────────────────────────────────────
GITHUB_PAGES_BASE_URL="https://tce-ce6.github.io/widgets-ww"

# ── Load shared library ────────────────────────────────────────────────────────
source "$(dirname "${BASH_SOURCE[0]}")/_deploy-lib.sh"
set -euo pipefail

lib_validate_config
lib_check_tools
lib_validate_script_js

cd "$SCRIPT_DIR"

# ── Build local widget folder index ───────────────────────────────────────────
ALL_WIDGET_DIRS=()
for dir in wg*/; do
  [[ -d "$dir" ]] && ALL_WIDGET_DIRS+=("${dir%/}")
done
[[ ${#ALL_WIDGET_DIRS[@]} -eq 0 ]] && fail "No widget folders (wg*) found."
IFS=$'\n' ALL_WIDGET_DIRS=($(printf '%s\n' "${ALL_WIDGET_DIRS[@]}" | sort)); unset IFS

resolve_folder() {
  local num="${1#[wW][gG]}"; num="${num%/}"
  for dir in "${ALL_WIDGET_DIRS[@]}"; do
    [[ "$dir" =~ ^wg${num}(-|$) ]] && { echo "$dir"; return 0; }
  done
  return 1
}

# ── Git username ───────────────────────────────────────────────────────────────
lib_get_git_username

if [[ -n "$GIT_USERNAME" ]]; then
  printf "\n${BOLD}Creator:${NC} %s\n" "$GIT_USERNAME"
  read -rp "  Use this name? [Y/n]: " _KEEP
  if [[ "$_KEEP" =~ ^[Nn]$ ]]; then GIT_USERNAME=""; fi
fi

if [[ -z "$GIT_USERNAME" ]]; then
  while true; do
    read -rp "  Enter your name: " GIT_USERNAME
    GIT_USERNAME="$(echo "$GIT_USERNAME" | xargs)"
    [[ -n "$GIT_USERNAME" ]] && break
    warn "Name cannot be empty."
  done
fi
ok "Creator: $GIT_USERNAME"

# ── Collect widget numbers ─────────────────────────────────────────────────────
step "Selecting widgets..."

printf "\n${BOLD}Available widget folders:${NC}\n"
printf '%s\n' "──────────────────────────────────────────────────────────"
for dir in "${ALL_WIDGET_DIRS[@]}"; do
  WG_KEY=$(echo "$dir" | grep -oE '^wg[0-9]+')
  STATUS_HINT=""
  [[ -f "$dir/widget.json" ]] && \
    STATUS_HINT=$(PYTHONIOENCODING=utf-8 $PYTHON -c \
      "import json; d=json.load(open('${dir}/widget.json')); print('['+d.get('status','')+']')" \
      2>/dev/null || true)
  printf "  %-8s  %-45s %s\n" "${WG_KEY})" "$dir" "$STATUS_HINT"
done
printf '%s\n' "──────────────────────────────────────────────────────────"
echo ""

INPUT_NUMS=()
if [[ $# -gt 0 ]]; then
  for arg in "$@"; do INPUT_NUMS+=("$arg"); done
  printf "  Using numbers from arguments: %s\n" "${INPUT_NUMS[*]}"
else
  while true; do
    read -rp "Enter widget numbers separated by spaces (e.g. 104 112 121): " RAW_INPUT
    RAW_INPUT="$(echo "$RAW_INPUT" | xargs)"
    [[ -n "$RAW_INPUT" ]] && break
    warn "Please enter at least one widget number."
  done
  read -ra INPUT_NUMS <<< "$RAW_INPUT"
fi

SELECTED_FOLDERS=()
NOT_FOUND=()
for num in "${INPUT_NUMS[@]}"; do
  folder=$(resolve_folder "$num") && SELECTED_FOLDERS+=("$folder") \
    || NOT_FOUND+=("$num")
done

if [[ ${#NOT_FOUND[@]} -gt 0 ]]; then
  warn "Not found locally (skipped):"
  for n in "${NOT_FOUND[@]}"; do printf "    - wg%s\n" "${n#[wW][gG]}"; done
fi
[[ ${#SELECTED_FOLDERS[@]} -eq 0 ]] && fail "No valid widget folders found."

printf "\n  ${BOLD}Widgets selected (%s):${NC}\n" "${#SELECTED_FOLDERS[@]}"
for f in "${SELECTED_FOLDERS[@]}"; do printf "    • %s\n" "$f"; done
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
    *) warn "Enter 1-4 or p." ;;
  esac
done

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
printf "  Creator: %s\n\n" "$GIT_USERNAME"

read -rp "  Proceed? [Y/n]: " CONFIRM
if [[ "$CONFIRM" =~ ^[Nn]$ ]]; then printf "\n  Aborted.\n\n"; exit 0; fi

# ── Write widget.json for each selected widget ─────────────────────────────────
step "Writing widget.json files..."

for i in "${!SELECTED_FOLDERS[@]}"; do
  WIDGET_FOLDER="${SELECTED_FOLDERS[$i]}"
  WIDGET_STATUS="${SELECTED_STATUSES[$i]}"
  WG_NUM=$(echo "$WIDGET_FOLDER" | grep -oE '[0-9]+' | head -1)
  RAW_TITLE=$(echo "$WIDGET_FOLDER" | sed 's/^wg[0-9]*-//' | tr '-' ' ')
  WIDGET_TITLE=$(PYTHONIOENCODING=utf-8 $PYTHON -c "print('$RAW_TITLE'.title())")
  WIDGET_URL="${GITHUB_PAGES_BASE_URL}/${WIDGET_FOLDER}/"

  lib_write_widget_json "$WIDGET_FOLDER" "$WIDGET_TITLE" "$WIDGET_URL" \
    "$GIT_USERNAME" "$WIDGET_STATUS"
  ok "wg${WG_NUM}  [${WIDGET_STATUS}]  ${WIDGET_TITLE}"
done

# ── Rebuild manifest ───────────────────────────────────────────────────────────
lib_build_manifest

printf "\n${GREEN}${BOLD}Done!${NC}\n"
lib_show_next_steps
