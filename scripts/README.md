# LinkNest Scripts

This directory contains utility scripts for managing the LinkNest project.

## Available Scripts

### create-github-project.sh

Creates a complete GitHub project board with all issues. This script:

- Creates a new GitHub project
- Sets up all necessary labels
- Creates milestones
- Populates the project with 18 comprehensive issues

**Prerequisites:**

- GitHub CLI (`gh`) must be installed and authenticated
- You need appropriate permissions to create projects in the repository

**Usage:**

```bash
./scripts/create-github-project.sh
```

### create-issues-only.sh

Creates only the GitHub issues without creating a project. This is useful if:

- You don't have permissions to create projects
- You want to manually create and configure the project board
- You already have a project and just want to populate it with issues

**Prerequisites:**

- GitHub CLI (`gh`) must be installed and authenticated

**Usage:**

```bash
./scripts/create-issues-only.sh
```

## Authentication

Before running any scripts, make sure you're authenticated with GitHub:

```bash
gh auth login
```

Follow the prompts to authenticate via your preferred method (browser or token).

## Manual Project Setup

If you prefer to set up the project manually:

1. Go to your repository: https://github.com/ilyapaddubny/LinkNest
2. Click on "Projects" tab
3. Click "New project"
4. Choose "Board" view
5. Name it "LinkNest Development"
6. Add the following columns:
   - Backlog
   - To Do
   - In Progress
   - In Review
   - Done

Then run `create-issues-only.sh` to populate your repository with issues that you can manually add to the project board.
