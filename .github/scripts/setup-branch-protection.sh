#!/bin/bash

# Setup Branch Protection Rules for LinkNest
# This script configures branch protection rules for the main branch
# Run with: gh auth login && bash .github/scripts/setup-branch-protection.sh

REPO="ilyapaddubny/LinkNest"
BRANCH="main"

echo "Setting up branch protection rules for $REPO:$BRANCH..."

# Create branch protection rules
gh api \
  --method PUT \
  -H "Accept: application/vnd.github+json" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  /repos/$REPO/branches/$BRANCH/protection \
  --input - <<EOF
{
  "required_status_checks": {
    "strict": true,
    "contexts": ["lint", "test", "build"]
  },
  "enforce_admins": false,
  "required_pull_request_reviews": {
    "dismiss_stale_reviews": true,
    "require_code_owner_reviews": true,
    "required_approving_review_count": 1
  },
  "restrictions": null,
  "allow_force_pushes": false,
  "allow_deletions": false,
  "required_conversation_resolution": true,
  "lock_branch": false,
  "allow_fork_syncing": true
}
EOF

echo "Branch protection rules configured successfully!"