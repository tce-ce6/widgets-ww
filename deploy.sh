#!/usr/bin/env bash
# ==============================================================================
# deploy.sh  —  DEPRECATED
# ==============================================================================
# This script has been replaced by two focused scripts:
#
#   deploy-widget.sh    →  deploy your individual widget folder
#   deploy-listing.sh   →  deploy listing page changes
#
# Please use one of the above instead.
# See DEPLOY.md for full instructions.
# ==============================================================================

RED='\033[0;31m'; BOLD='\033[1m'; NC='\033[0m'
printf "\n${RED}${BOLD}deploy.sh is deprecated.${NC}\n\n"
printf "Use one of the new scripts:\n\n"
printf "  ${BOLD}./deploy-widget.sh${NC}   — to deploy your widget folder\n"
printf "  ${BOLD}./deploy-listing.sh${NC}  — to deploy listing page changes\n\n"
printf "See DEPLOY.md for full instructions.\n\n"
exit 1
