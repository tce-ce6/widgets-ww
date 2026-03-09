#!/usr/bin/env bash
# ==============================================================================
# deploy.sh  —  Register a widget for GitHub Pages
# ==============================================================================
# Writes a widget.json into the chosen widget folder, then rebuilds the
# widget-listing-b3/data/widgets.json manifest that the listing page reads.
# GitHub Pages publishes automatically when changes are pushed to 'deploy'.
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
#   • Git    — https://git-scm.com
#   • Python — pre-installed on macOS/Linux; https://python.org on Windows
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

# ── Select widget folder ───────────────────────────────────────────────────────
step "Scanning widget folders..."

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
  # Show existing status from widget.json if present
  STATUS_HINT=""
  [[ -f "$dir/widget.json" ]] && \
    STATUS_HINT=$(PYTHONIOENCODING=utf-8 $PYTHON -c \
      "import json,sys; d=json.load(open('${dir}/widget.json')); print('['+d.get('status','')+']')" \
      2>/dev/null || true)
  printf "  %-8s  %-45s %s\n" "${WG_KEY})" "$dir" "$STATUS_HINT"
done
printf '%s\n' "──────────────────────────────────────────────────────────"
echo ""

WIDGET_FOLDER=""
while true; do
  read -rp "Enter the wg number (e.g. 121): " SEL
  SEL="${SEL#[wW][gG]}"
  if [[ "$SEL" =~ ^[0-9]+$ ]]; then
    for dir in "${WIDGET_DIRS[@]}"; do
      if [[ "$dir" =~ ^wg${SEL}(-|$) ]]; then
        WIDGET_FOLDER="$dir"; break
      fi
    done
  fi
  [[ -n "$WIDGET_FOLDER" ]] && break
  warn "No folder found for 'wg${SEL}'. Check the list above."
  WIDGET_FOLDER=""
done

WG_NUM=$(echo "$WIDGET_FOLDER" | grep -oE '[0-9]+' | head -1)
RAW_TITLE=$(echo "$WIDGET_FOLDER" | sed 's/^wg[0-9]*-//' | tr '-' ' ')
WIDGET_TITLE=$(PYTHONIOENCODING=utf-8 $PYTHON -c "print('$RAW_TITLE'.title())")
WIDGET_URL="${GITHUB_PAGES_BASE_URL}/${WIDGET_FOLDER}/"
ok "Selected: $WIDGET_FOLDER"
printf "  URL: %s\n" "$WIDGET_URL"

# ── Show existing status as default ───────────────────────────────────────────
CURRENT_STATUS=""
if [[ -f "$WIDGET_FOLDER/widget.json" ]]; then
  CURRENT_STATUS=$(PYTHONIOENCODING=utf-8 $PYTHON -c \
    "import json; d=json.load(open('$WIDGET_FOLDER/widget.json')); print(d.get('status',''))" \
    2>/dev/null || true)
fi

echo ""
printf "${BOLD}Widget status:${NC}\n"
printf "  1) Closed\n  2) Review\n  3) WIP\n  4) Todo\n"
[[ -n "$CURRENT_STATUS" ]] && printf "  Current: %s\n" "$CURRENT_STATUS"
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
    *) warn "Enter 1–4." ;;
  esac
done

# ── Write widget.json ──────────────────────────────────────────────────────────
step "Writing $WIDGET_FOLDER/widget.json..."
lib_write_widget_json "$WIDGET_FOLDER" "$WIDGET_TITLE" "$WIDGET_URL" \
  "$GIT_USERNAME" "$WIDGET_STATUS"
ok "widget.json written."

# ── Rebuild manifest ───────────────────────────────────────────────────────────
lib_build_manifest

printf "\n${GREEN}${BOLD}Done!${NC}\n"
lib_show_next_steps
