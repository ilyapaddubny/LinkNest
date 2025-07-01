#!/bin/bash

# LinkNest GitHub Issues Creation Script
# This script creates all the issues for the LinkNest project

echo "LinkNest Issues Creation"
echo "======================="
echo ""

# Check if gh CLI is authenticated
if ! gh auth status &>/dev/null; then
    echo "Error: You need to authenticate with GitHub first."
    echo "Run: gh auth login"
    exit 1
fi

# Get repository information
REPO_OWNER=$(gh repo view --json owner -q .owner.login 2>/dev/null || echo "ilyapaddubny")
REPO_NAME=$(gh repo view --json name -q .name 2>/dev/null || echo "LinkNest")

echo "Repository: $REPO_OWNER/$REPO_NAME"
echo ""

# Create labels if they don't exist
echo "Creating labels..."

# Define labels with format: name:color:description
declare -a labels=(
    "setup:0969da:Infrastructure and setup"
    "infrastructure:0969da:Infrastructure related"
    "high-priority:b60205:Critical for MVP"
    "auth:1d76db:Authentication related"
    "security:d73a4a:Security improvements"
    "feature:a2eeef:New feature or request"
    "frontend:7057ff:Frontend development"
    "backend:d4c5f9:Backend development"
    "ui/ux:fef2c0:User interface and experience"
    "component:bfd4f2:Component development"
    "analytics:f9d0c4:Analytics and metrics"
    "performance:fbca04:Performance optimization"
    "optimization:fbca04:Code optimization"
    "testing:e4e669:Testing related"
    "quality:e4e669:Code quality"
    "devops:0e8a16:DevOps and deployment"
    "deployment:0e8a16:Deployment related"
)

for label in "${labels[@]}"; do
    IFS=':' read -r name color description <<< "$label"
    gh label create "$name" --color "$color" --description "$description" 2>/dev/null || echo "Label '$name' already exists or cannot be created"
done

# Function to create an issue
create_issue() {
    local title="$1"
    local body="$2"
    local labels="$3"
    
    echo ""
    echo "Creating issue: $title"
    gh issue create --title "$title" --body "$body" --label "$labels" 2>/dev/null || echo "Failed to create issue: $title"
}

# Prompt user to continue
echo ""
echo "This script will create 18 issues in your repository."
read -p "Do you want to continue? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Aborted."
    exit 0
fi

# Create all issues
echo ""
echo "Creating issues..."

# Core Infrastructure Issues
create_issue "Initialize Next.js Project with TypeScript" \
"## Description
- Set up Next.js 14+ with App Router
- Configure TypeScript with strict mode
- Set up ESLint and Prettier according to Claude.md guidelines
- Configure pnpm workspaces for monorepo structure
- Set up Tailwind CSS for styling

## Acceptance Criteria
- [ ] Next.js project initialized with TypeScript
- [ ] ESLint and Prettier configured
- [ ] Tailwind CSS integrated
- [ ] Basic folder structure following conventions" \
"setup,infrastructure,high-priority"

create_issue "Set up Database and ORM" \
"## Description
- Choose and set up database (PostgreSQL recommended)
- Configure Prisma or Drizzle ORM
- Create initial schema for users, links, and collections
- Set up database migrations

## Acceptance Criteria
- [ ] Database connection established
- [ ] ORM configured and working
- [ ] Initial schema created
- [ ] Migration system in place" \
"backend,infrastructure,high-priority"

create_issue "Configure Authentication System" \
"## Description
- Implement authentication using NextAuth.js or Clerk
- Support OAuth providers (Google, GitHub)
- Set up session management
- Create protected route middleware

## Acceptance Criteria
- [ ] Users can sign up/sign in
- [ ] OAuth providers integrated
- [ ] Protected routes working
- [ ] Session persistence" \
"auth,security,high-priority"

# Core Features
create_issue "Create Link Management CRUD Operations" \
"## Description
- Create API routes for link CRUD operations
- Implement link model with proper validation
- Add metadata extraction for links (title, description, favicon)
- Implement link shortening functionality

## Acceptance Criteria
- [ ] Users can create, read, update, delete links
- [ ] Link metadata automatically extracted
- [ ] Short URLs generated
- [ ] Proper error handling" \
"feature,backend,high-priority"

create_issue "Build Link Collections Feature" \
"## Description
- Allow users to organize links into collections
- Implement drag-and-drop for link organization
- Add collection sharing capabilities
- Create collection templates

## Acceptance Criteria
- [ ] Users can create/manage collections
- [ ] Links can be organized into collections
- [ ] Collections can be shared publicly
- [ ] Drag-and-drop functionality works" \
"feature,frontend,backend"

create_issue "Implement Search and Filtering" \
"## Description
- Add full-text search for links and collections
- Implement tag-based filtering
- Create advanced search with multiple criteria
- Add search suggestions

## Acceptance Criteria
- [ ] Search functionality works across all content
- [ ] Filtering by tags, date, collection
- [ ] Search results are relevant and fast
- [ ] Search suggestions implemented" \
"feature,frontend,backend"

# User Interface
create_issue "Design and Implement Dashboard" \
"## Description
- Create main dashboard layout
- Implement responsive design
- Add quick actions for common tasks
- Create analytics widgets

## Acceptance Criteria
- [ ] Dashboard displays user's links and collections
- [ ] Responsive on all devices
- [ ] Quick add link functionality
- [ ] Basic analytics visible" \
"frontend,ui/ux,high-priority"

create_issue "Build Link Card Component" \
"## Description
- Create reusable link card component
- Display link preview with metadata
- Add action buttons (edit, delete, share)
- Implement hover states and animations

## Acceptance Criteria
- [ ] Link cards display all metadata
- [ ] Actions are easily accessible
- [ ] Smooth animations
- [ ] Accessible design" \
"frontend,component"

create_issue "Create Public Profile Pages" \
"## Description
- Build public profile pages for users
- Display public collections
- Add customization options
- Implement SEO optimization

## Acceptance Criteria
- [ ] Public profiles accessible via username
- [ ] Collections displayed nicely
- [ ] Customizable themes
- [ ] SEO-friendly URLs and metadata" \
"feature,frontend"

# Advanced Features
create_issue "Add Import/Export Functionality" \
"## Description
- Import bookmarks from browsers
- Support various formats (HTML, JSON, CSV)
- Export collections in multiple formats
- Bulk operations support

## Acceptance Criteria
- [ ] Import from major browsers works
- [ ] Multiple export formats supported
- [ ] Progress indicators for bulk operations
- [ ] Error handling for invalid data" \
"feature,enhancement"

create_issue "Implement Link Analytics" \
"## Description
- Track link clicks and usage
- Create analytics dashboard
- Add link popularity metrics
- Generate reports

## Acceptance Criteria
- [ ] Click tracking implemented
- [ ] Analytics dashboard shows key metrics
- [ ] Historical data available
- [ ] Export analytics data" \
"feature,analytics"

create_issue "Build Browser Extension" \
"## Description
- Create browser extension for quick link saving
- Support Chrome and Firefox
- Add right-click context menu
- Implement keyboard shortcuts

## Acceptance Criteria
- [ ] Extension saves links with one click
- [ ] Works on Chrome and Firefox
- [ ] Context menu integration
- [ ] Configurable shortcuts" \
"feature,enhancement"

# Performance & Quality
create_issue "Implement Caching Strategy" \
"## Description
- Set up Redis for caching
- Cache link metadata
- Implement API response caching
- Add cache invalidation logic

## Acceptance Criteria
- [ ] Redis configured and working
- [ ] Metadata cached effectively
- [ ] API responses cached where appropriate
- [ ] Cache invalidation works correctly" \
"performance,backend"

create_issue "Add Comprehensive Testing" \
"## Description
- Set up testing framework (Vitest/Jest)
- Write unit tests for critical functions
- Add integration tests for API routes
- Implement E2E tests with Playwright

## Acceptance Criteria
- [ ] 80% code coverage achieved
- [ ] All critical paths tested
- [ ] E2E tests for main user flows
- [ ] Tests run in CI pipeline" \
"testing,quality"

create_issue "Optimize Performance" \
"## Description
- Implement lazy loading for images
- Add pagination for large collections
- Optimize database queries
- Implement code splitting

## Acceptance Criteria
- [ ] Page load time < 2.5s
- [ ] Smooth scrolling with large datasets
- [ ] No N+1 query problems
- [ ] Bundle size optimized" \
"performance,optimization"

# DevOps & Deployment
create_issue "Set up CI/CD Pipeline" \
"## Description
- Configure GitHub Actions
- Set up automated testing
- Implement semantic versioning
- Configure deployment pipeline

## Acceptance Criteria
- [ ] Tests run on every PR
- [ ] Automated deployment to staging
- [ ] Version tags created automatically
- [ ] Build status badges added" \
"devops,infrastructure"

create_issue "Configure Production Deployment" \
"## Description
- Set up Vercel or similar hosting
- Configure environment variables
- Set up monitoring and logging
- Implement error tracking

## Acceptance Criteria
- [ ] Application deployed to production
- [ ] Environment variables secured
- [ ] Monitoring in place
- [ ] Error tracking configured" \
"devops,deployment"

create_issue "Implement Security Best Practices" \
"## Description
- Run security audit
- Implement rate limiting
- Add CSRF protection
- Configure security headers

## Acceptance Criteria
- [ ] No critical security vulnerabilities
- [ ] Rate limiting on API routes
- [ ] CSRF tokens implemented
- [ ] Security headers configured" \
"security,high-priority"

echo ""
echo "Issue creation complete!"
echo ""
echo "View your issues at: https://github.com/$REPO_OWNER/$REPO_NAME/issues"
echo ""
echo "Next steps:"
echo "1. Create a GitHub Project manually at: https://github.com/$REPO_OWNER/$REPO_NAME/projects"
echo "2. Add the issues to your project board"
echo "3. Configure project columns (Backlog, To Do, In Progress, In Review, Done)"
echo "4. Start organizing issues by priority"