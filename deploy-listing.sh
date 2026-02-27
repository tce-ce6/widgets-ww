#!/usr/bin/env bash
# ==============================================================================
# deploy-listing.sh  —  Deploy the widget listing page (and all live widgets)
# ==============================================================================
# Run this when you update the listing page (HTML / CSS / JS).
# It re-deploys the listing page together with all widgets that are already
# live (read from WIDGET_DATA in widget-listing-b3/script/script.js).
# It does NOT add or modify any individual widget.
#
# Usage:
#   chmod +x deploy-listing.sh   (first time only)
#   ./deploy-listing.sh
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

# ── Confirm intent ─────────────────────────────────────────────────────────────
printf "\n${BOLD}Listing-page deploy${NC}\n"
printf "  This will publish the latest listing page changes.\n"
printf "  All currently live widgets will be re-included automatically.\n"
printf "  No widget entries in script.js will be modified.\n\n"
read -rp "Continue? [Y/n]: " _CONFIRM
[[ "${_CONFIRM:-Y}" =~ ^[Nn]$ ]] && { echo "Cancelled."; exit 0; }

# ── Write Firebase config files ────────────────────────────────────────────────
lib_write_firebase_configs

# ── Build dist/ (listing + all deployed widgets, no new widget) ───────────────
lib_build_dist ""

# ── Deploy ─────────────────────────────────────────────────────────────────────
step "Deploying to Firebase Hosting..."
printf "  Project : %s\n" "$FIREBASE_PROJECT_ID"
printf "  Site    : %s.web.app\n" "$FIREBASE_HOSTING_SITE_ID"
echo ""
lib_deploy "$FIREBASE_PROJECT_ID" "${FIREBASE_TOKEN:-}"

printf "\n${GREEN}${BOLD}Done!${NC}\n\n"
printf "  Listing page: https://%s.web.app/\n\n" "$FIREBASE_HOSTING_SITE_ID"
