#!/usr/bin/env bash
# ==============================================================================
# deploy-admin.sh  —  Admin: mark all widgets with updatedByAdmin and
#                      regenerate the listing manifest
# ==============================================================================
# For every wg*/widget.json file found locally, adds:
#   "updatedByAdmin": true
# without modifying any other field.
# Then rebuilds widget-listing-b3/data/widgets.json.
#
# Usage:
#   macOS / Linux:
#     chmod +x deploy-admin.sh   (first time only)
#     ./deploy-admin.sh
#
#   Windows (Git Bash):
#     bash deploy-admin.sh
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

# ── Count existing widget.json files ──────────────────────────────────────────
WIDGET_JSON_COUNT=0
for dir in wg*/; do
  [[ -f "${dir}widget.json" ]] && (( WIDGET_JSON_COUNT++ )) || true
done

# ── Banner ─────────────────────────────────────────────────────────────────────
printf "\n${BOLD}╔══════════════════════════════════════════════╗${NC}\n"
printf "${BOLD}║         ADMIN MANIFEST REBUILD               ║${NC}\n"
printf "${BOLD}╚══════════════════════════════════════════════╝${NC}\n\n"
printf "  widget.json files found : %s\n" "$WIDGET_JSON_COUNT"
printf "\n"
printf "  ${YELLOW}Action:${NC}    adds ${BOLD}updatedByAdmin: true${NC} to every widget.json\n"
printf "  ${YELLOW}Protected:${NC} creators · status · name · link · imagePath · updatedAt\n\n"

read -rp "  Proceed? [y/N]: " CONFIRM
if [[ ! "$CONFIRM" =~ ^[Yy]$ ]]; then printf "\n  Aborted.\n\n"; exit 0; fi

# ── Add updatedByAdmin: true to each widget.json (PATCH — no other field touched)
step "Patching widget.json files..."

PYTHONIOENCODING=utf-8 $PYTHON - "$SCRIPT_DIR" << 'PYEOF'
import sys, os, json

script_dir = sys.argv[1]
count = 0

for entry in sorted(os.listdir(script_dir)):
    if not entry.startswith('wg'):
        continue
    json_path = os.path.join(script_dir, entry, 'widget.json')
    if not os.path.isfile(json_path):
        continue
    try:
        with open(json_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        data['updatedByAdmin'] = True
        with open(json_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
            f.write('\n')
        print(f"  ✓ {entry}")
        count += 1
    except Exception as e:
        print(f"  (warning: skipped {json_path} — {e})")

print(f"\n  Patched {count} widget.json file(s).")
PYEOF

ok "All widget.json files patched."

# ── Rebuild manifest ───────────────────────────────────────────────────────────
lib_build_manifest

printf "\n${GREEN}${BOLD}Done!${NC}\n"
lib_show_next_steps
