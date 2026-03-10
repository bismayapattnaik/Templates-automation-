# Development Setup Guide

Complete guide for setting up the project for local development.

## Prerequisites

Before starting, ensure you have:

- **Node.js** 18.0.0 or higher
  - Check: `node --version`
- **npm** 9.0.0 or higher
  - Check: `npm --version`
- **Git** 2.35 or higher
  - Check: `git --version`
- **Anthropic API Key** (free tier available)
  - Get from: https://console.anthropic.com/

## Initial Setup

### 1. Clone Repository

```bash
git clone <repository-url>
cd Templates-automation-
git checkout claude/design-to-template-Tz0V9
```

### 2. Install Dependencies

```bash
npm install
```

This installs all dependencies specified in `package.json`.

### 3. Environment Configuration

```bash
# Copy example environment file
cp .env.example .env

# Edit .env and add your Anthropic API key
# Linux/Mac:
nano .env

# Windows:
notepad .env
```

**Required environment variable:**
```
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxxxxxxx
```

**Optional but recommended:**
```
NODE_ENV=development
PORT=3000
LOG_LEVEL=debug
```

### 4. Verify Setup

```bash
# Check TypeScript compilation
npm run build

# The command should complete without errors
# You'll see dist/ folder created
```

## Running the Application

### Development Mode (with auto-reload)

```bash
npm run dev
```

This:
- Starts Express server on `http://localhost:3000`
- Watches TypeScript files for changes
- Auto-reloads on save
- Shows detailed logs

**Expected output:**
```
[timestamp] [INFO] 🚀 Server running on http://localhost:3000
[timestamp] [INFO] 📝 API Health: http://localhost:3000/api/health
[timestamp] [INFO] 🎨 Frontend: http://localhost:3000
```

### Production Mode

```bash
# Build
npm run build

# Start
npm start
```

### Verify Server is Running

Open in browser or curl:
```bash
curl http://localhost:3000/api/health

# Expected response:
# {"status":"ok","timestamp":"2026-03-10T...","uptime":...}
```

## Development Workflow

### File Changes & Auto-reload

When using `npm run dev`:
- Edit any `.ts` file in `backend/src/`
- File saves trigger automatic TypeScript compilation
- Server reloads with changes
- No manual restart needed

### Frontend Development

Frontend files are served automatically:
- HTML: `/frontend/index.html`
- CSS: `/frontend/css/`
- JavaScript: `/frontend/js/main.js`

**No build step required** - browsers load directly.

To make changes:
1. Edit files in `/frontend`
2. Save and refresh browser
3. Changes appear immediately

### TypeScript Development

For backend development:

1. Edit `.ts` files in `backend/src/`
2. Run `npm run build` to compile
3. Or use `npm run dev` for auto-compile

Check compilation:
```bash
npm run build
```

## Code Quality

### Linting

```bash
# Check for code issues
npm run lint

# Expected: ESLint finds 0 errors
```

Fix lint errors:
```bash
# Automatic fix for auto-fixable issues
npm run lint -- --fix
```

### Code Formatting

```bash
# Format all code with Prettier
npm run format

# This standardizes:
# - Indentation
# - Quotes
# - Line lengths
# - Semicolons
```

### TypeScript Checking

```bash
# Build (includes TypeScript type checking)
npm run build

# Expected: "Successfully compiled TypeScript"
```

## Testing (Phase 2+)

When test suite is added:

```bash
# Run all tests
npm test

# Run unit tests only
npm run test:unit

# Run integration tests only
npm run test:integration

# Watch mode (re-run on changes)
npm test -- --watch
```

## Debugging

### Browser DevTools

1. Open `http://localhost:3000` in browser
2. Press F12 to open Developer Tools
3. Check Console tab for JavaScript errors
4. Check Network tab for API calls

### Server Logs

With `npm run dev`, detailed logs appear in terminal:

```
[timestamp] [DEBUG] Request received
[timestamp] [INFO] Processing template
[timestamp] [WARN] Issue detected
[timestamp] [ERROR] Error occurred
```

Change log level in `.env`:
```
LOG_LEVEL=debug   # Most verbose
LOG_LEVEL=info    # Standard
LOG_LEVEL=warn    # Warnings only
LOG_LEVEL=error   # Errors only
```

### VS Code Debugging

Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Launch Program",
      "skipFiles": ["<node_internals>/**"],
      "program": "${workspaceFolder}/backend/src/index.ts",
      "preLaunchTask": "tsc: build",
      "outFiles": ["${workspaceFolder}/dist/**/*.js"]
    }
  ]
}
```

Then press F5 to start debugging.

## Common Issues & Solutions

### Port Already in Use

```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solution:**
```bash
# Find process using port 3000
lsof -i :3000

# Kill it
kill -9 <PID>

# Or use different port
PORT=3001 npm run dev
```

### API Key Not Found

```
Error: ANTHROPIC_API_KEY environment variable is required
```

**Solution:**
1. Check `.env` file exists
2. Verify `ANTHROPIC_API_KEY=sk-ant-...` is present
3. No quotes around the key
4. Restart `npm run dev`

### TypeScript Compilation Error

```
error TS2322: Type 'X' is not assignable to type 'Y'
```

**Solution:**
1. Check type definitions in `backend/src/types/index.ts`
2. Ensure imports are correct
3. Run `npm run build` to see full error

### Dependencies Not Installed

```
Error: Cannot find module 'express'
```

**Solution:**
```bash
rm -rf node_modules
npm install
npm run dev
```

## Project Structure Quick Reference

```
backend/src/
├── index.ts              # Server entry point
├── config/
│   ├── environment.ts    # Env vars
│   └── anthropic.ts      # Claude config
├── types/
│   └── index.ts          # TypeScript interfaces
└── utils/
    └── logger.ts         # Logging

frontend/
├── index.html            # Main page
├── css/
│   ├── variables.css     # CSS variables
│   ├── layout.css        # Grid layout
│   ├── styles.css        # Components
│   └── components.css    # Utilities
└── js/
    └── main.js           # App logic
```

## Git Workflow

### Current Branch

Always work on feature branch:
```bash
git branch
# * claude/design-to-template-Tz0V9
```

### Make Changes

```bash
# 1. Edit files
# 2. Check status
git status

# 3. Stage changes
git add backend/src/index.ts

# 4. Commit with message
git commit -m "feat: add template generation endpoint"

# 5. Push to origin
git push -u origin claude/design-to-template-Tz0V9
```

### Commit Message Format

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `style:` - Code style (no logic change)
- `refactor:` - Code restructuring
- `test:` - Test additions
- `chore:` - Build/tool updates

Example:
```bash
git commit -m "feat: implement Claude API integration

- Add image processing pipeline
- Implement response parsing
- Add error handling with retries"
```

## Useful Commands Reference

```bash
# Development
npm run dev              # Start with auto-reload
npm run build            # Compile TypeScript
npm start                # Run production

# Code Quality
npm run lint             # Check code
npm run format           # Auto-format code
npm run lint -- --fix    # Auto-fix linting errors

# Testing (Phase 2+)
npm test                 # Run all tests
npm run test:unit        # Unit tests only

# Cleanup
rm -rf dist              # Remove build output
rm -rf node_modules      # Remove dependencies
rm .env                  # Remove local config
```

## Next Steps

1. ✅ Complete setup (you are here)
2. ⏭️ Start Phase 2 development (Claude API)
3. 📝 Implement template generation
4. ✔️ Add SOP validators
5. 🧪 Write tests

## Getting Help

- Check documentation in `/docs` folder
- Review error messages carefully
- Check server logs with `npm run dev`
- Use browser DevTools for frontend issues
- Verify `.env` configuration

## Performance Tips

1. **Use `npm run dev`** for development (faster auto-reload)
2. **Keep one terminal** for server, use another for git
3. **Monitor memory** with `npm run dev` in long sessions
4. **Clear cache** if experiencing issues: `npm cache clean --force`
5. **Use .gitignore** to avoid committing node_modules

## Security Notes

⚠️ **Never commit:**
- `.env` file with API keys
- `node_modules/` directory
- `.DS_Store` or platform files
- Secrets or credentials

These are already in `.gitignore` - just be careful!

## References

- [Node.js docs](https://nodejs.org/docs/)
- [npm documentation](https://docs.npmjs.com/)
- [TypeScript handbook](https://www.typescriptlang.org/docs/)
- [Express.js guide](https://expressjs.com/en/guide/routing.html)
- [Anthropic API docs](https://docs.anthropic.com/)

---

**Ready to start?** Run `npm run dev` and visit `http://localhost:3000` 🚀
