# Widget Deployment Guide

## Quick Start

## One time

```bash


# 1. Install Firebase CLI (once per machine)
npm install -g firebase-tools

# 2. Authenticate (once per machine)
firebase login

# 3. Make script executable (once per repo)
chmod +x deploy.sh
```

## repeat
```bash
# 4. deploy to firebase 

./deploy.sh
```

The script will prompt you for your **name** (first run only), ask you to **select a widget folder**, then deploy automatically.

---

## Branch Workflow

- Always work on your own branch — never commit to `main`
- Only commit your widget folder: `git add wg000-your-widget-name/`
- Do **not** commit `firebase.json`, `.firebaserc`, or `.creator_profile` — these are gitignored

---

## Deployed URLs

| | URL |
|---|---|
| Main listing | `https://tce-widgets.web.app/` |
| Your widget | `https://tce-widgets.web.app/wg000-your-widget-name/` |

---

## Thumbnail

Add a `300×300` PNG screenshot to `widget-listing-b3/assets/wg-{number}.png` before deploying.  
Example: `wg121-synthesize-new-dna-strand` → `assets/wg-121.png`

---

## Troubleshooting

| Problem | Fix |
|---|---|
| `401` auth error | `firebase login --reauth` |
| `firebase: command not found` | `npm install -g firebase-tools` |
| `python3: command not found` | `brew install python3` |
| Widget not in listing | Remove its entry from `widget-listing-b3/script/script.js` and re-run `./deploy.sh` |
| Merge conflict in `script.js` | Keep **both** widget entries, ensure each ends with a comma, then re-deploy |
