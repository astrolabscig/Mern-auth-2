# Changelog - Mern-auth-2

## 2026-04-29

### Fixed

**backend/index.js: console.log hardcoded port 5000**

Changed console.log to use the PORT variable. When PORT is overridden in the environment (e.g. Render assigns a dynamic port), the log now shows the actual listening port.

**backend/index.js: DB connection not awaited before server starts**

The original called connectDB() inside app.listen without awaiting it. Changed to an async startServer() pattern that awaits connectDB() first and calls process.exit(1) on failure, so hosting platforms restart automatically.

**backend/index.js: dotenv import style updated**

Changed from the two-statement pattern to import 'dotenv/config' as the first line for clarity and correctness.

### Added

- .env.example: Documents all required environment variables
- README.md: Full project docs with setup instructions and API endpoint table
