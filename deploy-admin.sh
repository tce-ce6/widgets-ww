#!/usr/bin/env bash
# ==============================================================================
# deploy-admin.sh  —  Admin full-site deployment
# ==============================================================================
# Deploys EVERY local widget folder and the listing page to Firebase Hosting.
# For each existing record in the Realtime Database, adds one field:
#
#   updatedByAdmin: true
#
# All other fields are READ-ONLY — this script will NEVER modify:
#   creators · imagePath · link · name · status · updatedAt
#
# Usage:
#   macOS / Linux:
#     chmod +x deploy-admin.sh   (first time only)
#     ./deploy-admin.sh
#
#   Windows (Git Bash):
#     bash deploy-admin.sh
#
# Pre-requisites:
#   • Node.js      — https://nodejs.org
#   • Firebase CLI — npm install -g firebase-tools
#   • Python       — pre-installed on macOS/Linux; https://python.org on Windows
# ==============================================================================

# ── Configuration — must match deploy.sh ──────────────────────────────────────
FIREBASE_PROJECT_ID="widgets-c812e"
FIREBASE_HOSTING_SITE_ID="tce-widgets"
FIREBASE_TOKEN=""    # leave empty to use browser login (firebase login)

# ── Load shared library ────────────────────────────────────────────────────────
source "$(dirname "${BASH_SOURCE[0]}")/_deploy-lib.sh"
set -euo pipefail

lib_validate_config
lib_check_tools
lib_auth_check

DB_URL="https://${FIREBASE_PROJECT_ID}-default-rtdb.firebaseio.com/widgets.json"
HOSTING_BASE_URL="https://${FIREBASE_HOSTING_SITE_ID}.web.app"

# ── Count local widget folders ─────────────────────────────────────────────────
cd "$SCRIPT_DIR"
WIDGET_DIRS=()
for dir in wg*/; do
  [[ -d "$dir" ]] && WIDGET_DIRS+=("${dir%/}")
done
[[ ${#WIDGET_DIRS[@]} -eq 0 ]] && fail "No widget folders (wg*) found locally."
IFS=$'\n' WIDGET_DIRS=($(printf '%s\n' "${WIDGET_DIRS[@]}" | sort)); unset IFS

# ── Banner ─────────────────────────────────────────────────────────────────────
printf "\n${BOLD}╔══════════════════════════════════════════════╗${NC}\n"
printf "${BOLD}║         ADMIN FULL-SITE DEPLOYMENT           ║${NC}\n"
printf "${BOLD}╚══════════════════════════════════════════════╝${NC}\n\n"
printf "  Project     : %s\n"   "$FIREBASE_PROJECT_ID"
printf "  Site        : %s\n"   "${FIREBASE_HOSTING_SITE_ID}.web.app"
printf "  Local wg*   : %s folders\n" "${#WIDGET_DIRS[@]}"
printf "\n"
printf "  ${YELLOW}DB update:${NC} adds  ${BOLD}updatedByAdmin: true${NC}  to every existing record.\n"
printf "  ${YELLOW}Protected:${NC} creators · status · name · link · imagePath · updatedAt\n"
printf "\n"
read -rp "  Proceed? [y/N]: " CONFIRM
if [[ ! "$CONFIRM" =~ ^[Yy]$ ]]; then
  printf "\n  Aborted.\n\n"
  exit 0
fi

# ── Write Firebase config files ────────────────────────────────────────────────
lib_write_firebase_configs

# ── Fetch DB widget keys ───────────────────────────────────────────────────────
step "Fetching widget keys from Firebase Realtime Database..."

DB_KEYS=$(PYTHONIOENCODING=utf-8 $PYTHON - "$DB_URL" << 'PYEOF'
import sys, json, ssl
try:
    from urllib.request import urlopen
except ImportError:
    from urllib2 import urlopen

db_url = sys.argv[1]
try:
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE
    with urlopen(db_url, context=ctx) as resp:
        data = json.loads(resp.read().decode('utf-8'))
    if data:
        for key in sorted(data.keys()):
            print(key)
    else:
        print("(empty)", file=sys.stderr)
except Exception as e:
    print(f"ERROR: {e}", file=sys.stderr)
    sys.exit(1)
PYEOF
)

if [[ -z "$DB_KEYS" ]]; then
  warn "No records found in the database. Skipping DB update step."
else
  KEY_COUNT=$(echo "$DB_KEYS" | wc -l | tr -d ' ')
  ok "Found ${KEY_COUNT} record(s) in the database."
fi

# ── Add updatedByAdmin: true to every DB record (PATCH — no other field touched) ─
if [[ -n "$DB_KEYS" ]]; then
  step "Updating database records (adding updatedByAdmin: true)..."
  printf "  ${YELLOW}Only${NC} ${BOLD}updatedByAdmin${NC} is written. All other fields are untouched.\n\n"

  while IFS= read -r key; do
    [[ -z "$key" ]] && continue
    firebase database:update "/widgets/${key}" \
      --data '{"updatedByAdmin": true}' \
      --project "$FIREBASE_PROJECT_ID" \
      --force 2>&1 | grep -v "^$" || true
    printf "  ✓ %s\n" "$key"
  done <<< "$DB_KEYS"

  ok "All database records updated."
fi

# ── Build dist/ — ALL local wg* folders + listing page ────────────────────────
step "Building dist/ (listing page + all ${#WIDGET_DIRS[@]} local widget folders)..."

PYTHONIOENCODING=utf-8 $PYTHON - "$SCRIPT_DIR" << 'PYEOF'
import sys, os, shutil

script_dir = sys.argv[1]
dist_dir   = os.path.join(script_dir, 'dist')

SKIP_DIRS  = {'.vscode', 'node_modules', '.git', 'dist'}
SKIP_EXT   = {'.md', '.pptx', '.zip', '.rar', '.7z', '.docx', '.sh'}
SKIP_FILES = {'firebase.json', '.firebaserc', '.creator_profile',
              '.gitignore', '.DS_Store', 'DEPLOY.md', 'database.rules.json'}

def should_ignore(path, names):
    ignored = []
    for n in names:
        full = os.path.join(path, n)
        if n in SKIP_DIRS or n in SKIP_FILES:
            ignored.append(n)
        elif os.path.isfile(full) and os.path.splitext(n)[1].lower() in SKIP_EXT:
            ignored.append(n)
    return ignored

def sync(src, dst):
    if os.path.exists(dst):
        shutil.rmtree(dst)
    shutil.copytree(src, dst, ignore=should_ignore)

os.makedirs(dist_dir, exist_ok=True)

# Listing page — always
sync(os.path.join(script_dir, 'widget-listing-b3'),
     os.path.join(dist_dir,   'widget-listing-b3'))
print("  + widget-listing-b3")

# Every local wg* folder — no exclusions, no DB check required
widget_dirs = sorted(
    d for d in os.listdir(script_dir)
    if d.startswith('wg') and os.path.isdir(os.path.join(script_dir, d))
)
for folder in widget_dirs:
    sync(os.path.join(script_dir, folder),
         os.path.join(dist_dir,   folder))
    print(f"  + {folder}")

total = sum(len(files) for _, _, files in os.walk(dist_dir))
print(f"\n  Total: {total} files across {len(widget_dirs)} widget folders")
PYEOF

ok "dist/ ready."

# ── Deploy to Firebase Hosting ─────────────────────────────────────────────────
step "Deploying to Firebase Hosting..."
printf "  Project : %s\n" "$FIREBASE_PROJECT_ID"
printf "  Site    : %s.web.app\n" "$FIREBASE_HOSTING_SITE_ID"
printf "  Folders : %s widget(s) + listing page\n" "${#WIDGET_DIRS[@]}"
echo ""
lib_deploy "$FIREBASE_PROJECT_ID" "${FIREBASE_TOKEN:-}"

printf "\n${GREEN}${BOLD}Done!${NC}\n\n"
printf "  Site : %s/\n\n" "$HOSTING_BASE_URL"
