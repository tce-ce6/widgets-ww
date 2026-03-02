#!/usr/bin/env bash
# ==============================================================================
# pr.sh  —  Create and merge a Pull Request to the deploy branch
# ==============================================================================
# Workflow:
#   1. Ensures you are on a personal deploy-{name} branch (not deploy directly)
#   2. Stages and commits your changes
#   3. Pushes your branch to origin
#   4. Creates a PR from your branch → deploy
#   5. Checks for conflicts, then optionally merges
#
# Usage:
#   macOS / Linux:
#     chmod +x pr.sh    (first time only)
#     ./pr.sh
#
#   Windows (Git Bash):
#     bash pr.sh
#
# Pre-requisites:
#   • Git       — https://git-scm.com
#   • GitHub CLI (gh) — https://cli.github.com
#     Install:  brew install gh           (macOS)
#               winget install GitHub.cli  (Windows)
#     Auth:     gh auth login
# ==============================================================================

set -euo pipefail

BASE_BRANCH="deploy"

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

# ── Check tools ────────────────────────────────────────────────────────────────
step "Checking required tools..."
command -v git &>/dev/null || fail "git is not installed."
command -v gh  &>/dev/null || fail "GitHub CLI (gh) is not installed.
  Install with:  brew install gh       (macOS)
                 winget install GitHub.cli  (Windows)
  Then run:      gh auth login"
ok "git and gh found."

# ── Check gh auth ──────────────────────────────────────────────────────────────
if ! gh auth status &>/dev/null; then
  warn "GitHub CLI is not authenticated."
  printf "  Opening browser login...\n"
  gh auth login
fi
ok "GitHub CLI authenticated."

# ── Detect current branch ──────────────────────────────────────────────────────
CURRENT_BRANCH="$(git branch --show-current)"

if [[ -z "$CURRENT_BRANCH" ]]; then
  fail "Not on any branch (detached HEAD). Check out your branch first."
fi

printf "\n${BOLD}Current branch:${NC} %s\n" "$CURRENT_BRANCH"

# ── Guard: must NOT be on the base branch directly ────────────────────────────
if [[ "$CURRENT_BRANCH" == "$BASE_BRANCH" ]]; then
  warn "You are on '${BASE_BRANCH}' directly. You should work on your own branch."
  printf "\n  Your branch should follow the pattern:  deploy-{yourname}\n"
  printf "  Examples:  deploy-nitin  deploy-pkp  deploy-shyam\n\n"
  read -rp "  Enter your branch name (e.g. deploy-nitin): " NEW_BRANCH
  NEW_BRANCH="$(echo "$NEW_BRANCH" | xargs)"
  [[ -z "$NEW_BRANCH" ]] && fail "Branch name cannot be empty."

  if git show-ref --verify --quiet "refs/heads/$NEW_BRANCH"; then
    git checkout "$NEW_BRANCH"
    ok "Switched to existing branch: $NEW_BRANCH"
  else
    git checkout -b "$NEW_BRANCH"
    ok "Created and switched to new branch: $NEW_BRANCH"
  fi
  CURRENT_BRANCH="$NEW_BRANCH"
fi

# ── Show working tree status ───────────────────────────────────────────────────
step "Git status..."
git status --short

CHANGED=$(git status --porcelain | wc -l | tr -d ' ')
if [[ "$CHANGED" -eq 0 ]]; then
  warn "Nothing to commit. Your working tree is clean."
  printf "\n  If you have already pushed your changes, a PR may already exist.\n"
  printf "  Checking...\n\n"

  EXISTING_PR=$(gh pr list --base "$BASE_BRANCH" --head "$CURRENT_BRANCH" \
                  --json number,title,url --jq '.[0]' 2>/dev/null || true)
  if [[ -n "$EXISTING_PR" ]]; then
    PR_NUM=$(echo "$EXISTING_PR" | grep -o '"number":[0-9]*' | grep -o '[0-9]*')
    PR_URL=$(echo "$EXISTING_PR" | grep -o '"url":"[^"]*"' | cut -d'"' -f4)
    printf "  Found open PR #%s:\n  %s\n\n" "$PR_NUM" "$PR_URL"
    read -rp "  Merge this PR now? [y/N]: " MERGE_NOW
    if [[ "$MERGE_NOW" =~ ^[Yy]$ ]]; then
      _do_merge "$PR_NUM" "$PR_URL"
    else
      printf "\n  PR left open. Run this script again to merge when ready.\n\n"
    fi
    exit 0
  else
    printf "  No open PR found for this branch.\n"
    printf "  Make some changes, then re-run this script.\n\n"
    exit 0
  fi
fi

# ── Commit message ─────────────────────────────────────────────────────────────
step "Commit your changes..."
printf "\n  Changed files (%s):\n" "$CHANGED"
git status --short | sed 's/^/    /'
echo ""

read -rp "  Enter a commit message: " COMMIT_MSG
COMMIT_MSG="$(echo "$COMMIT_MSG" | xargs)"
[[ -z "$COMMIT_MSG" ]] && fail "Commit message cannot be empty."

# ── Stage and commit ───────────────────────────────────────────────────────────
git add -A
git commit -m "$COMMIT_MSG"
ok "Changes committed: \"$COMMIT_MSG\""

# ── Pull latest base to check for conflicts before pushing ────────────────────
step "Fetching latest '${BASE_BRANCH}' from origin..."
git fetch origin "$BASE_BRANCH" 2>&1 | grep -v "^$" || true

BEHIND=$(git rev-list --count "HEAD..origin/${BASE_BRANCH}" 2>/dev/null || echo "0")
if [[ "$BEHIND" -gt 0 ]]; then
  warn "Your branch is ${BEHIND} commit(s) behind origin/${BASE_BRANCH}."
  printf "\n  It is recommended to merge the latest changes first to avoid conflicts:\n"
  printf "\n    git merge origin/%s\n\n" "$BASE_BRANCH"
  read -rp "  Merge origin/${BASE_BRANCH} into your branch now? [Y/n]: " DO_MERGE
  if [[ ! "$DO_MERGE" =~ ^[Nn]$ ]]; then
    if git merge "origin/${BASE_BRANCH}" --no-edit; then
      ok "Merged origin/${BASE_BRANCH} into ${CURRENT_BRANCH}."
    else
      printf "\n"
      warn "Merge conflicts detected. Resolve them, then re-run this script."
      printf "\n  Steps to resolve:\n"
      printf "    1. Fix the conflicting files shown above\n"
      printf "    2. git add <resolved-files>\n"
      printf "    3. git merge --continue\n"
      printf "    4. Run ./pr.sh again\n\n"
      exit 1
    fi
  fi
fi

# ── Push branch to origin ──────────────────────────────────────────────────────
step "Pushing '${CURRENT_BRANCH}' to origin..."
git push -u origin "$CURRENT_BRANCH"
ok "Branch pushed."

# ── Create PR (skip if already open) ──────────────────────────────────────────
step "Creating Pull Request → ${BASE_BRANCH}..."

EXISTING_PR=$(gh pr list --base "$BASE_BRANCH" --head "$CURRENT_BRANCH" \
                --json number,url --jq '.[0]' 2>/dev/null || true)

if [[ -n "$EXISTING_PR" ]]; then
  PR_NUM=$(echo "$EXISTING_PR" | grep -o '"number":[0-9]*' | grep -o '[0-9]*')
  PR_URL=$(echo "$EXISTING_PR" | grep -o '"url":"[^"]*"' | cut -d'"' -f4)
  warn "A PR already exists: #${PR_NUM}"
  printf "  %s\n" "$PR_URL"
else
  PR_URL=$(gh pr create \
    --base "$BASE_BRANCH" \
    --head "$CURRENT_BRANCH" \
    --title "$COMMIT_MSG" \
    --body "$(printf "Branch: \`%s\`\n\n%s" "$CURRENT_BRANCH" "$COMMIT_MSG")" \
    2>&1)
  PR_NUM=$(gh pr list --base "$BASE_BRANCH" --head "$CURRENT_BRANCH" \
             --json number --jq '.[0].number' 2>/dev/null || true)
  ok "PR created: ${PR_URL}"
fi

# ── Check for merge conflicts ─────────────────────────────────────────────────
step "Checking PR #${PR_NUM} for conflicts..."
sleep 2

PR_STATE=$(gh pr view "$PR_NUM" --json mergeable,mergeStateStatus \
             --jq '"\(.mergeable) \(.mergeStateStatus)"' 2>/dev/null || echo "UNKNOWN UNKNOWN")
MERGEABLE=$(echo "$PR_STATE" | awk '{print $1}')
MERGE_STATUS=$(echo "$PR_STATE" | awk '{print $2}')

printf "  Mergeable    : %s\n" "$MERGEABLE"
printf "  Merge status : %s\n" "$MERGE_STATUS"

if [[ "$MERGEABLE" == "CONFLICTING" ]]; then
  printf "\n"
  warn "This PR has merge conflicts and cannot be merged automatically."
  printf "\n  Resolve conflicts locally:\n"
  printf "    git fetch origin %s\n" "$BASE_BRANCH"
  printf "    git merge origin/%s\n" "$BASE_BRANCH"
  printf "    # fix conflicts, then:\n"
  printf "    git add .\n"
  printf "    git merge --continue\n"
  printf "    git push origin %s\n" "$CURRENT_BRANCH"
  printf "\n  PR URL: %s\n\n" "$PR_URL"
  exit 1
fi

# ── Merge PR ───────────────────────────────────────────────────────────────────
printf "\n"
read -rp "  Merge PR #${PR_NUM} into '${BASE_BRANCH}' now? [Y/n]: " CONFIRM_MERGE
if [[ "$CONFIRM_MERGE" =~ ^[Nn]$ ]]; then
  printf "\n  PR left open for review.\n"
  printf "  PR URL: %s\n\n" "$PR_URL"
  exit 0
fi

step "Merging PR #${PR_NUM}..."
gh pr merge "$PR_NUM" --merge --delete-branch
ok "PR #${PR_NUM} merged into '${BASE_BRANCH}'."

printf "\n${GREEN}${BOLD}Done!${NC}\n"
printf "  Branch '${CURRENT_BRANCH}' has been merged into '${BASE_BRANCH}'.\n"
printf "  PR: %s\n\n" "$PR_URL"
