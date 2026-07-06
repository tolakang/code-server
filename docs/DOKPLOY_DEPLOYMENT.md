# Dokploy Deployment Guide

A step-by-step guide to deploying Mobile Code Server on Dokploy.

## Overview

This project wraps [codercom/code-server](https://github.com/coder/code-server) with a mobile-optimized React UI and a Node.js backend API. The Docker container runs three services internally:

```
Internet → Dokploy Traefik → Container :8080 → nginx
  ├── /                    → React app (static files)
  ├── /api/users/*         → backend (:3000) → PostgreSQL
  ├── /api/teams/*         → backend (:3000) → PostgreSQL
  ├── /api/audit/*         → backend (:3000) → PostgreSQL
  ├── /api/notifications/* → backend (:3000) → PostgreSQL
  ├── /api/workspaces/*    → backend (:3000) → PostgreSQL
  ├── /api/ai/*            → backend (:3000)
  ├── /api/mcp/*           → backend (:3000)
  ├── /api/terminal        → code-server (:8081)
  ├── /api/files           → code-server (:8081)
  └── /websocket/*         → code-server (:8081)
```

- **nginx** serves the React app and reverse-proxies requests to backend or code-server
- **Backend** (Express.js) handles users, teams, audit logs, notifications, workspaces, AI, and MCP
- **code-server** runs internally on `127.0.0.1:8081` (VS Code server)
- **PostgreSQL** stores persistent data (users, teams, audit logs, etc.)
- **Dokploy Traefik** handles external routing, SSL termination, and load balancing

## Prerequisites

- Dokploy server installed and running (v0.4.0+)
- A domain pointed to your Dokploy server (e.g., `code.yourdomain.com`)
- Git installed on your local machine
- A GitHub account

## Step 1: Fork the Repository

1. Go to [github.com/tolakang/code-server](https://github.com/tolakang/code-server)
2. Click **Fork** to create your own copy
3. Clone your fork locally:

```bash
git clone https://github.com/YOUR_USERNAME/code-server.git mobile-code-server
cd mobile-code-server
```

## Step 2: Create a Dokploy Project

1. Log into your Dokploy dashboard (e.g., `https://dokploy.yourdomain.com`)
2. Click **Create Project**
3. Fill in:
   - **Project Name:** `mobile-code-server` (or any name you prefer)
   - **Description:** Optional
4. Click **Create**

## Step 3: Connect Your Git Repository

1. In your project, go to **Git** tab
2. Select **GitHub** as the provider
3. Authorize Dokploy to access your GitHub repos (if not already done)
4. Select your forked repository (`mobile-code-server`)
5. Set **Branch:** `master`
6. Click **Save**

## Step 4: Configure the Docker Build

1. In your project, go to **Settings** tab
2. Under **Build Configuration**:
   - **Dockerfile Location:** `docker/Dockerfile`
   - **Build Context:** `.` (root of the repo)
3. Click **Save**

> **Important:** The Dockerfile path must be exactly `docker/Dockerfile`. If you leave it blank, Dokploy will look for `Dockerfile` in the root, which doesn't exist.

## Step 5: Configure Your Domain

1. In your project, go to **Domains** tab
2. Click **Add Domain**
3. Fill in:
   - **Domain Name:** `code.yourdomain.com` (your actual domain)
   - **Internal Port:** `8080`
   - **HTTPS:** Enable (recommended)
   - **Certificate Resolver:** `letsencrypt` (if configured in Dokploy)
4. Click **Save**

> **Port 8080** is the only port exposed by the container. nginx listens on this port and handles all routing internally.

## Step 6: Set Up PostgreSQL Database

The application requires a PostgreSQL database. You have two options:

### Option A: Dokploy Managed Database (Recommended)

1. In your project, go to **Databases** tab
2. Click **Create Database**
3. Fill in:
   - **Database Type:** PostgreSQL
   - **Database Name:** `mobile_code_server`
   - **Username:** `postgres`
   - **Password:** Generate a strong password
4. Note the connection details (host, port, credentials)
5. Update your environment variables (Step 7) with these credentials

### Option B: External PostgreSQL

If you have an existing PostgreSQL instance, note the connection details and configure them in Step 7.

## Step 7: Configure Environment Variables

Set these in the Dokploy project under **Environment** tab:

| Variable | Required | Description |
|----------|----------|-------------|
| `DB_HOST` | Yes | PostgreSQL host (e.g., `postgres` for Dokploy DB) |
| `DB_PORT` | Yes | PostgreSQL port (default: `5432`) |
| `DB_USER` | Yes | PostgreSQL username |
| `DB_PASSWORD` | Yes | PostgreSQL password |
| `DB_NAME` | Yes | PostgreSQL database name |
| `JWT_SECRET` | Yes | Random string for JWT signing |
| `SESSION_SECRET` | Yes | Random string for session signing |
| `AUTH_TYPE` | No | `none` (default) or `password` |
| `AI_PROVIDER` | No | `opencode` (default), `claude`, `gemini` |
| `LOG_LEVEL` | No | `info` (default), `debug`, `error` |

### Generate Secrets

```bash
# Generate random secrets
openssl rand -hex 32  # Use for JWT_SECRET
openssl rand -hex 32  # Use for SESSION_SECRET
```

## Step 8: Deploy

1. Go to the **Deployments** tab
2. Click **Deploy**
3. Wait for the build to complete (typically 3-5 minutes)
4. Check the build logs for any errors

### Build Process

The Docker build has two stages:

1. **Builder stage** — Installs Node.js dependencies and builds the React app
2. **Final stage** — Installs nginx, git, curl on top of `codercom/code-server:latest`, copies the React build output, installs backend dependencies, and configures the entrypoint

### What Happens on Startup

1. Backend server starts and connects to PostgreSQL
2. Database migrations run automatically (creates tables if needed)
3. Default data is seeded (admin user, default team, default workspace)
4. nginx starts and begins listening on port 8080
5. code-server starts on port 8081

## Step 9: Verify Deployment

1. Once deployed, visit `https://code.yourdomain.com`
2. You should see the Mobile Code Server dashboard
3. Verify these features work:
   - Dashboard loads at `/dashboard`
   - Editor opens at `/editor`
   - Terminal works at `/terminal`
   - File explorer at `/explorer`
   - Users management at `/users`
   - Teams management at `/teams`
   - Audit logs at `/audit-logs`

## Persistent Storage

The Docker Compose configuration uses named volumes for persistence:

| Volume | Container Path | Purpose |
|--------|----------------|---------|
| `project-data` | `/home/coder/project` | Your workspace files |
| `code-server-data` | `/home/coder/.local/share/code-server` | Extensions and settings |
| `code-server-config` | `/home/coder/.config/code-server` | Code-server configuration |
| `postgres_data` | `/var/lib/postgresql/data` | PostgreSQL data |

## Troubleshooting

### Bad Gateway Error

**Symptom:** Domain loads but shows "Bad Gateway"

**Causes and fixes:**
1. **Container not running** — Check the **Deployments** tab for errors
2. **Wrong port** — Ensure your domain is configured for internal port `8080`
3. **Entrypoint failure** — Check container logs for backend, nginx, or code-server errors

### Build Fails: `apt-get` Permission Error

**Symptom:** Build fails with `E: List directory /var/lib/apt/lists/partial is missing`

**Fix:** This is already fixed in the Dockerfile. If you see this, make sure you're on the latest `master` branch.

### Build Fails: Missing Import

**Symptom:** `Could not resolve "../api/teamApi"` or similar

**Fix:** Make sure all source files are committed. Run `git pull origin master` to get the latest.

### Database Connection Error

**Symptom:** Backend server fails to start with connection error

**Fix:**
1. Verify PostgreSQL is running and accessible
2. Check `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` environment variables
3. Ensure the database exists and the user has access

### Container Starts But No Logs

**Symptom:** Deployment shows success but the site doesn't load

**Fix:** Check that the entrypoint script is working:
1. In Dokploy, go to your deployment logs
2. Look for backend startup messages: `Backend server running on http://127.0.0.1:3000`
3. Look for nginx startup (no output means success)
4. Look for code-server startup: `HTTP server listening on http://127.0.0.1:8081/`

## Updating

### Automatic Updates

If you've configured CI/CD with GitHub Actions (see `.github/workflows/ci.yml`), pushes to `master` will trigger a rebuild.

### Manual Updates

1. Pull the latest changes:
   ```bash
   git pull origin master
   git push origin master
   ```
2. In Dokploy, go to your project
3. Click **Deploy** to trigger a new build

## Architecture Details

### Container Internals

```
┌─────────────────────────────────────────────────┐
│  Container (port 8080 exposed)                  │
│                                                 │
│  nginx (:8080)                                  │
│  ├── /                    → React app (static)  │
│  ├── /api/users/*         → backend (:3000)     │
│  ├── /api/teams/*         → backend (:3000)     │
│  ├── /api/audit/*         → backend (:3000)     │
│  ├── /api/notifications/* → backend (:3000)     │
│  ├── /api/workspaces/*    → backend (:3000)     │
│  ├── /api/ai/*            → backend (:3000)     │
│  ├── /api/mcp/*           → backend (:3000)     │
│  ├── /api/terminal        → code-server (:8081)  │
│  ├── /api/files           → code-server (:8081)  │
│  └── /websocket/*         → code-server (:8081)  │
│                                                 │
│  backend (:3000)   — Express + PostgreSQL        │
│  code-server (:8081) — VS Code server           │
└─────────────────────────────────────────────────┘
```

### File Structure

```
docker/
├── Dockerfile        # Multi-stage build: React + backend + nginx
├── entrypoint.sh     # Starts backend, nginx, code-server
└── nginx.conf        # Reverse proxy config for port 8080

server/
├── package.json      # Backend dependencies (Express, Knex, pg)
├── knexfile.js       # Database configuration
├── migrations/       # Database schema migrations
├── seeds/            # Default data (admin user, team)
└── src/
    ├── index.js      # Express app entry point
    ├── db.js         # PostgreSQL connection
    └── routes/       # API handlers (users, teams, audit, etc.)

wrapper/app/          # React mobile wrapper source
├── src/
│   ├── components/   # AI, Teams, Users, Notifications, etc.
│   ├── pages/        # Dashboard, Editor, Terminal, Explorer
│   └── api/          # API client modules
└── dist/             # Built output (copied to container)
```

### Database Schema

| Table | Purpose |
|-------|---------|
| `users` | User accounts (id, username, email, role, status) |
| `teams` | Teams (id, name, description) |
| `team_members` | Team membership (team_id, user_id) |
| `audit_logs` | Audit trail (user_id, action, resource, details) |
| `notifications` | User notifications (user_id, title, message, read) |
| `workspaces` | Workspace registry (name, path, user_id) |

## Security Notes

- Authentication is **disabled by default**. Set `AUTH_TYPE=password` before exposing to the internet.
- Use strong random values for `JWT_SECRET` and `SESSION_SECRET`.
- Use HTTPS in production. Dokploy integrates with Let's Encrypt for automatic SSL certificates.
- The container runs as root internally (required for nginx + code-server + backend triple process). This is standard for single-purpose containers.
