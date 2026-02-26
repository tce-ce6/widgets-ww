# Widget Deployment Guide

Two focused scripts handle all deployments. Use the one that matches your task.

| Script | When to use |
|---|---|
| `deploy-widget.sh` | Deploying your own widget folder |
| `deploy-listing.sh` | Deploying changes to the listing page (HTML / CSS / JS) |

Both scripts share the same Firebase config and build the deploy package automatically — you never need to manage `dist/` manually.

---

## Quick Start

### Deploy a widget
```bash
chmod +x deploy-widget.sh   # first time only
./deploy-widget.sh
```

### Deploy the listing page
```bash
chmod +x deploy-listing.sh  # first time only
./deploy-listing.sh
```

---

## How it Works

Firebase Hosting is snapshot-based — every deploy replaces the entire site. To avoid wiping other teams' widgets, both scripts build a `dist/` folder before deploying that contains:

- `widget-listing-b3/` — the listing page
- Every widget folder referenced in `WIDGET_DATA` in `script.js` — previously deployed widgets
- (For `deploy-widget.sh` only) the widget you're deploying now

`script.js` (committed to git) is the single source of truth. Any developer on any branch will always build the correct set of files because they read the same manifest.

The `dist/` folder is auto-generated and gitignored. You never touch it.

---

## Prerequisites (one-time setup)

### macOS / Linux
```bash
# Node.js — https://nodejs.org
# Firebase CLI
npm install -g firebase-tools
# Login
firebase login
```

### Windows (Git Bash)
```bash
# 1. Install Node.js — https://nodejs.org  (includes npm)
# 2. Install Python — https://python.org/downloads
#    ✓ Check "Add Python to PATH" during installation
# 3. Install Firebase CLI
npm install -g firebase-tools
# 4. Login
firebase login
# 5. Run scripts via Git Bash (not PowerShell / CMD)
bash deploy-widget.sh
bash deploy-listing.sh
```

---

## Configuration (one-time, inside each script)

Both scripts have the same three variables at the top:

```bash
FIREBASE_PROJECT_ID="widgets-c812e"       # Firebase project ID
FIREBASE_HOSTING_SITE_ID="tce-widgets"    # Hosting site subdomain
FIREBASE_TOKEN=""                          # Leave empty to use browser login
```

These are already filled in. You only need to change them if the project moves.

---

## Branch Workflow

1. Create your branch: `git checkout -b feature/wg-{number}-widget-name`
2. Build your widget in `wg{number}-widget-name/`
3. Run `./deploy-widget.sh` — your widget is live and `script.js` is updated
4. Commit `script.js` and your widget folder
5. Open a PR

Listing page maintainers run `./deploy-listing.sh` after merging listing page PRs.

---

## Deployed URLs

| Location | URL |
|---|---|
| Listing page | `https://tce-widgets.web.app/` |
| Individual widget | `https://tce-widgets.web.app/wg{number}-widget-name/` |

---

## Troubleshooting

| Problem | Fix |
|---|---|
| `firebase: command not found` | `npm install -g firebase-tools` |
| 401 auth error during deploy | `firebase login --reauth` |
| `python3: command not found` (Windows) | Scripts auto-detect `python3`, `python`, and `py`. Make sure Python is installed and added to PATH. |
| Widget not in listing after deploy | Check that `script.js` was committed and `git pull` on other machines |
| `bad substitution` on macOS | Make sure you're running with `bash`, not `sh` |
