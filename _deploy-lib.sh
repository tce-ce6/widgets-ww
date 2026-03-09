#!/usr/bin/env bash
# ==============================================================================
# _deploy-lib.sh  —  shared library for deploy-widget.sh and deploy-listing.sh
# Do NOT run this file directly. It is sourced by the deploy scripts.
# ==============================================================================

# ── Required configuration — edit these in each deploy script ─────────────────
# FIREBASE_PROJECT_ID and FIREBASE_HOSTING_SITE_ID must be set before sourcing.

# ── Internal paths ─────────────────────────────────────────────────────────────
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[1]}")" && pwd)"
MAIN_SCRIPT_JS="$SCRIPT_DIR/widget-listing-b3/script/script.js"
FIREBASE_JSON="$SCRIPT_DIR/firebase.json"
FIREBASERC="$SCRIPT_DIR/.firebaserc"
DIST_DIR="$SCRIPT_DIR/dist"
CREATOR_PROFILE_FILE="$SCRIPT_DIR/.creator_profile"

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
  if [[ "${FIREBASE_PROJECT_ID:-}" == "YOUR_PROJECT_ID" ]]; then
    fail "FIREBASE_PROJECT_ID is not set."
  fi
  if [[ "${FIREBASE_HOSTING_SITE_ID:-}" == "YOUR_HOSTING_SITE_ID" ]]; then
    fail "FIREBASE_HOSTING_SITE_ID is not set."
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
  command -v firebase &>/dev/null || \
    fail "Firebase CLI not found. Install with: npm install -g firebase-tools"
  lib_detect_python
}

# ── Firebase auth check ────────────────────────────────────────────────────────
lib_auth_check() {
  if [[ -z "${FIREBASE_TOKEN:-}" ]]; then
    local accounts
    accounts=$(firebase login:list 2>/dev/null | grep -c "@" || true)
    if [[ "$accounts" -eq 0 ]]; then
      step "No Firebase account found. Opening browser login..."
      firebase login
    else
      ok "Firebase authenticated."
    fi
  fi
}

# ── Write firebase.json and .firebaserc ───────────────────────────────────────
lib_write_firebase_configs() {
  cat > "$FIREBASE_JSON" << EOF
{
  "hosting": {
    "site": "${FIREBASE_HOSTING_SITE_ID}",
    "public": "dist",
    "ignore": [
      "**/.DS_Store",
      "**/node_modules/**"
    ],
    "rewrites": [
      { "source": "/", "destination": "/widget-listing-b3/index.html" }
    ]
  }
}
EOF
  cat > "$FIREBASERC" << EOF
{
  "projects": {
    "default": "${FIREBASE_PROJECT_ID}"
  }
}
EOF
  ok "firebase.json and .firebaserc written."
}

# ── Validate listing-page script.js has the DB_URL declaration ────────────────
# This catches the common merge-conflict regression where an old branch's
# static WIDGET_DATA array replaces the Firebase-based script.js, leaving
# fetch(DB_URL) with no DB_URL declaration and breaking the listing page.
lib_validate_script_js() {
  if ! grep -q 'const DB_URL' "$MAIN_SCRIPT_JS" 2>/dev/null; then
    fail "widget-listing-b3/script/script.js is missing 'const DB_URL'.
  This usually means your branch has an old version of the file from a merge conflict.
  Fix it by running:
    git checkout origin/deploy -- widget-listing-b3/script/script.js
  Then re-run the deploy script."
  fi
  if grep -q 'const WIDGET_DATA' "$MAIN_SCRIPT_JS" 2>/dev/null; then
    fail "widget-listing-b3/script/script.js still contains a static 'const WIDGET_DATA' array.
  This version pre-dates the Firebase Realtime Database migration and must not be deployed.
  Fix it by running:
    git checkout origin/deploy -- widget-listing-b3/script/script.js
  Then re-run the deploy script."
  fi
}

# ── Build dist/ ────────────────────────────────────────────────────────────────
# Usage: lib_build_dist [new_widget_folder]
#   new_widget_folder — optional; the widget being deployed in this run.
#
# Always includes:
#   • widget-listing-b3/  (listing page)
#   • every wg* folder on this hosting site, sourced from Firebase Realtime DB
#   • the new widget folder (if provided)
#
# Skips all non-web files (.md, .vscode/, .sh, etc.) automatically.
lib_build_dist() {
  local new_widget="${1:-}"
  local db_url="https://${FIREBASE_PROJECT_ID}-default-rtdb.firebaseio.com/widgets.json"
  step "Building dist/ (listing page + deployed widgets)..."

  # PYTHONIOENCODING=utf-8 ensures non-ASCII folder names (e.g. Hindi widgets)
  # print correctly on Windows, where Python may default to a narrower encoding.
  PYTHONIOENCODING=utf-8 $PYTHON - "$SCRIPT_DIR" "$FIREBASE_HOSTING_SITE_ID" "$new_widget" "$db_url" \
  << 'PYEOF'
import sys, os, re, shutil, json
try:
    from urllib.request import urlopen
except ImportError:
    from urllib2 import urlopen  # Python 2 fallback (Git Bash on old Windows)

script_dir   = sys.argv[1]
hosting_site = sys.argv[2]
new_widget   = sys.argv[3]
db_url       = sys.argv[4]

dist_dir = os.path.join(script_dir, 'dist')

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

def remove_readonly(func, path, _):
    import stat
    try:
        os.chmod(path, stat.S_IWRITE)
        func(path)
    except Exception:
        pass

def sync(src, dst):
    if not os.path.isdir(src):
        return False
    if os.path.exists(dst):
        try:
            shutil.rmtree(dst, onexc=remove_readonly)
        except TypeError:
            shutil.rmtree(dst, onerror=remove_readonly)
    shutil.copytree(src, dst, ignore=should_ignore)
    return True

os.makedirs(dist_dir, exist_ok=True)

# Listing page — always
sync(os.path.join(script_dir, 'widget-listing-b3'),
     os.path.join(dist_dir,   'widget-listing-b3'))
print("  + widget-listing-b3")

# New widget being deployed right now
if new_widget:
    sync(os.path.join(script_dir, new_widget),
         os.path.join(dist_dir,   new_widget))
    print(f"  + {new_widget}  <- new")

# All previously deployed widgets — query the Realtime Database
# ssl._create_unverified_context() is used here because this is a local build
# tool reading public, read-only Firebase data. macOS Python often ships
# without bundled root certificates, causing SSL errors on urllib.
import ssl
deployed = []
try:
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE
    with urlopen(db_url, context=ctx) as resp:
        data = json.loads(resp.read().decode('utf-8'))
    if data:
        for entry in data.values():
            if not entry or 'link' not in entry:
                continue
            link = entry['link']
            if f'{hosting_site}.web.app/' not in link:
                continue
            folder = link.split(f'{hosting_site}.web.app/')[1].rstrip('/')
            if folder and folder != new_widget:
                deployed.append(folder)
except Exception as e:
    print(f"  (warning: could not fetch DB — {e})")

# ── Safety check: abort if any deployed widget folder is missing locally ──────
# Firebase Hosting replaces the ENTIRE site on each deploy. If a widget folder
# from another developer's branch is not present locally, it would be silently
# deleted from the live site. We fail loudly here instead.
missing = [f for f in sorted(set(deployed))
           if not os.path.isdir(os.path.join(script_dir, f))]
if missing:
    print("\n  ERROR: The following deployed widget folders are missing on this branch:")
    for f in missing:
        print(f"    - {f}")
    print("\n  These folders are live on the site. Deploying without them would")
    print("  delete them for everyone. To fix, pull the latest changes first:\n")
    print("    git pull origin <your-base-branch>\n")
    print("  Then re-run deploy.sh.\n")
    sys.exit(1)

for folder in sorted(set(deployed)):
    sync(os.path.join(script_dir, folder), os.path.join(dist_dir, folder))
    print(f"  + {folder}")

total = sum(len(files) for _, _, files in os.walk(dist_dir))
print(f"\n  Total: {total} files")
PYEOF

  ok "dist/ ready."
}

# ── Run Firebase deploy ────────────────────────────────────────────────────────
lib_deploy() {
  local project="$1"
  local token="${2:-}"
  local deploy_args=(deploy --only hosting --project "$project")
  [[ -n "$token" ]] && deploy_args+=(--token "$token")

  if ! firebase "${deploy_args[@]}"; then
    echo ""
    warn "Deployment failed."
    warn "If you saw a 401 error, your login token may be expired. Fix with:"
    printf "      firebase login --reauth\n"
    exit 1
  fi
}
