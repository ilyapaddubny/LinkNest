# Contributing to LinkNest

Thank you for your interest in contributing to LinkNest! We welcome contributions from the community and are grateful for any help you can provide.

## Code of Conduct

By participating in this project, you agree to abide by our code of conduct: be respectful, inclusive, and constructive in all interactions.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/yourusername/linknest.git`
3. Create a new branch: `git checkout -b feat/your-feature-name`
4. Make your changes
5. Commit using conventional commits: `git commit -m "feat: add new feature"`
6. Push to your fork: `git push origin feat/your-feature-name`
7. Create a Pull Request

## Development Setup

See the README.md for detailed setup instructions.

## Engineering Practices

We follow the guidelines outlined in our [CLAUDE.md](CLAUDE.md) file. Key principles:

### Core Principles

- **Readability > Cleverness** – Write clear, self-documenting code
- **Single Source of Truth** – No duplication of logic or data
- **Fail Fast, Recover Gracefully** – Handle errors at boundaries
- **Small PRs, Frequent Merges** – Keep PRs under 300 lines

### Code Style

- Use TypeScript with strict mode enabled
- Follow Prettier defaults for formatting
- Use ESLint with our custom rules
- Naming conventions:
  - `camelCase` for variables and functions
  - `PascalCase` for types and components
  - `UPPER_SNAKE_CASE` for constants

### Git Workflow

- We use trunk-based development with short-lived feature branches
- Branch naming convention:
  - `feat/[issue-number]-short-description` - for new features
  - `fix/[issue-number]-short-description` - for bug fixes
  - `chore/[issue-number]-short-description` - for maintenance tasks
  - `docs/[issue-number]-short-description` - for documentation updates
- Examples:
  - `feat/12-add-bookmark-tags`
  - `fix/23-oauth-redirect-loop`
  - `chore/45-update-dependencies`

### Commit Message Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

Types:

- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `style:` Code style changes (formatting, missing semicolons, etc)
- `refactor:` Code refactoring without adding features or fixing bugs
- `test:` Adding or modifying tests
- `chore:` Maintenance tasks, dependency updates, etc

Example commit messages:

```
feat: add bookmark tagging functionality

- Users can now add multiple tags to bookmarks
- Tags are searchable and filterable
- Implements tag autocomplete

Closes #12
```

To use our commit message template:

```bash
git config --local commit.template .gitmessage
```

### Pull Request Process

1. **Draft Early**: Create a draft PR as soon as you start work
2. **Link Issues**: Reference any related issues
3. **Provide Context**: Include:
   - Why: What problem does this solve?
   - What: Brief description of changes
   - How to Test: Steps to verify your changes
4. **Add Screenshots/Videos**: For UI changes, include visual proof
5. **Self-Review**: Use the checklist below before requesting review

### PR Review Checklist

Before requesting review, ensure:

- [ ] Code compiles without warnings
- [ ] All tests pass
- [ ] New code has appropriate test coverage
- [ ] Code follows our style guidelines
- [ ] No commented-out code or TODOs
- [ ] Documentation updated if needed
- [ ] No console.logs or debug statements
- [ ] Error handling is adequate
- [ ] Performance impact considered
- [ ] Security implications reviewed

### Testing

- Write tests for all new features
- Aim for 80% code coverage
- Test file naming: `*.test.ts` or `*.spec.ts`
- Use descriptive test names that explain the behavior

### Documentation

- Update relevant documentation with your changes
- Add JSDoc comments for public functions
- Keep the README up to date
- Document architectural decisions in ADRs

## Types of Contributions

### Bug Reports

- Use the issue template
- Include steps to reproduce
- Provide system information
- Include error messages and screenshots

### Feature Requests

- Check existing issues first
- Clearly describe the problem and solution
- Explain use cases and benefits

### Code Contributions

- Fix bugs
- Add new features
- Improve performance
- Enhance documentation
- Add or improve tests

## Questions?

Feel free to:

- Open an issue for questions
- Start a discussion in GitHub Discussions
- Reach out to maintainers

Thank you for contributing to LinkNest!
