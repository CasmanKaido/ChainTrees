# Contributing to ChainTrees

Thank you for your interest in contributing to ChainTrees! This document provides guidelines and instructions for contributing.

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on what is best for the community
- Show empathy towards other community members

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in Issues
2. If not, create a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Your environment (browser, OS, etc.)

### Suggesting Enhancements

1. Check if the enhancement has been suggested
2. Create an issue with:
   - Clear description of the enhancement
   - Why it would be useful
   - Possible implementation approach

### Pull Requests

1. Fork the repository
2. Create a new branch (`git checkout -b feature/AmazingFeature`)
3. Make your changes
4. Write or update tests as needed
5. Update documentation
6. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
7. Push to the branch (`git push origin feature/AmazingFeature`)
8. Open a Pull Request

## Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/ChainTrees.git

# Navigate to directory
cd ChainTrees

# Install dependencies
npm install

# Start development server
npm run dev
```

## Coding Standards

### JavaScript

- Use ES6+ features
- Follow existing code style
- Add JSDoc comments for functions
- Keep functions small and focused
- Use meaningful variable names

### CSS

- Use CSS variables for theming
- Follow BEM naming convention where applicable
- Keep selectors specific but not overly complex
- Use flexbox/grid for layouts

### Commits

- Use present tense ("Add feature" not "Added feature")
- Use imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit first line to 72 characters
- Reference issues and pull requests

Examples:
```
feat(marketplace): add auction countdown timer
fix(wallet): resolve connection timeout issue
docs(readme): update installation instructions
style(css): improve mobile responsiveness
```

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/          # Page components
├── services/       # Business logic
├── utils/          # Utility functions
├── styles/         # CSS files
└── config/         # Configuration
```

## Testing

```bash
# Run tests
npm test

# Run linter
npm run lint

# Format code
npm run format
```

## Documentation

- Update README.md for new features
- Add JSDoc comments for public APIs
- Update inline comments for complex logic
- Create examples for new components

## Feature Branches

- `feature/*` - New features
- `fix/*` - Bug fixes
- `docs/*` - Documentation updates
- `style/*` - Code style changes
- `refactor/*` - Code refactoring
- `test/*` - Test additions/changes
- `chore/*` - Maintenance tasks

## Review Process

1. All PRs require at least one review
2. Address review comments
3. Keep PRs focused and reasonably sized
4. Update your branch with main before merging

## Community

- Join our Discord (coming soon)
- Follow us on Twitter (coming soon)
- Read our blog (coming soon)

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Questions?

Feel free to open an issue with the `question` label.

Thank you for contributing to ChainTrees! 🌳
