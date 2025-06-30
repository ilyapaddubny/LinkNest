# GitHub Configuration

This directory contains GitHub-specific configuration files for the LinkNest project.

## Structure

```
.github/
├── ISSUE_TEMPLATE/          # Issue templates
│   ├── bug_report.md       # Bug report template
│   └── feature_request.md  # Feature request template
├── workflows/              # GitHub Actions workflows
│   └── pr-labeler.yml     # Automatic PR labeling
├── scripts/               # Utility scripts
│   └── setup-branch-protection.sh  # Branch protection setup
├── CODEOWNERS            # Code ownership rules
├── pull_request_template.md  # PR template
└── README.md            # This file
```

## Branch Protection

To enable branch protection rules for the `main` branch, run:

```bash
gh auth login
bash .github/scripts/setup-branch-protection.sh
```

This will configure:

- Require pull request reviews (1 approval minimum)
- Dismiss stale PR approvals when new commits are pushed
- Require status checks to pass (lint, test, build)
- Require branches to be up to date before merging
- Require conversation resolution before merging

## Pull Request Template

The PR template automatically populates when creating a new pull request. It includes:

- Description section
- Type of change checkboxes
- Related issue field
- Testing checklist
- General PR checklist

## CODEOWNERS

The CODEOWNERS file automatically assigns reviewers based on file paths. Currently, all files are owned by @ilyapaddubny.

## Automatic PR Labeling

The `pr-labeler.yml` workflow automatically adds labels based on:

- Branch name prefix (feat/, fix/, chore/, docs/)
- Issue number extracted from branch name

## Commit Message Template

To use the project's commit message template:

```bash
git config --local commit.template .gitmessage
```

This helps maintain consistent commit messages following Conventional Commits.
