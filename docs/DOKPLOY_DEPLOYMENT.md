# Dokploy Deployment Guide

A step-by-step guide to deploying Mobile Code Server on Dokploy.

## Overview

This project wraps [codercom/code-server](https://github.com/coder/code-server) with a mobile-optimized React UI. The Docker container runs two services internally:

```
Internet → Dokploy Traefik → Container :8080 → nginx
  ├── /            → React mobile wrapper (static files)
  ├── /api/*       → proxy → 127.0.0.1:8081 (code-server)
  └── /websocket   → proxy → 127.0.0.1:8081 (code-server)
```

- **nginx** serves the React app and reverse-proxies API/WebSocket requests to code-server
- **code-server** runs internally on `127.0.0.1:8081`
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

## Step 6: Deploy

1. Go to the **Deployments** tab
2. Click **Deploy**
3. Wait for the build to complete (typically 2-5 minutes)
4. Check the build logs for any errors

### Build Process

The Docker build has two stages:

1. **Builder stage** — Installs Node.js dependencies and builds the React app
2. **Final stage** — Installs nginx, git, curl on top of `codercom/code-server:latest`, copies the React build output, and configures the entrypoint

## Step 7: Verify Deployment

1. Once deployed, visit `https://code.yourdomain.com`
2. You should see the Mobile Code Server dashboard
3. Verify these features work:
   - Dashboard loads at `/dashboard`
   - Editor opens at `/editor`
   - Terminal works at `/terminal`
   - File explorer at `/explorer`

## Environment Variables

Set these in the Dokploy project under **Environment** tab if you need to customize behavior:

| Variable | Default | Description |
|----------|---------|-------------|
| `AUTH_TYPE` | `none` | Authentication type: `none`, `password`, or `github` |
| `CODE_SERVER_AUTH` | `none` | code-server auth: `none` or `password` |
| `CODE_SERVER_PASSWORD` | (empty) | Password for code-server (if auth enabled) |
| `DISABLE_TELEMETRY` | `true` | Disable code-server telemetry |

> **Note:** The container works out-of-the-box with no environment variables. Authentication is disabled by default for development. Enable it before using in production.

## Persistent Storage

To preserve your code and settings across container restarts, configure volume mounts in Dokploy:

1. Go to **Volumes** tab
2. Add these volume mappings:

| Container Path | Volume Name | Purpose |
|----------------|-------------|---------|
| `/home/coder/project` | `project-data` | Your workspace files |
| `/home/coder/.local/share/code-server` | `code-server-data` | Extensions and settings |
| `/home/coder/.config/code-server` | `code-server-config` | Code-server configuration |

## Troubleshooting

### Bad Gateway Error

**Symptom:** Domain loads but shows "Bad Gateway"

**Causes and fixes:**
1. **Container not running** — Check the **Deployments** tab for errors
2. **Wrong port** — Ensure your domain is configured for internal port `8080`
3. **Entrypoint failure** — Check container logs for nginx or code-server errors

### Build Fails: `apt-get` Permission Error

**Symptom:** Build fails with `E: List directory /var/lib/apt/lists/partial is missing`

**Fix:** This is already fixed in the Dockerfile. If you see this, make sure you're on the latest `master` branch.

### Build Fails: Missing Import

**Symptom:** `Could not resolve "../api/teamApi"` or similar

**Fix:** Make sure all source files are committed. Run `git pull origin master` to get the latest.

### Container Starts But No Logs

**Symptom:** Deployment shows success but the site doesn't load

**Fix:** Check that the entrypoint script is working:
1. In Dokploy, go to your deployment logs
2. Look for code-server startup messages:
   ```
   HTTP server listening on http://127.0.0.1:8081/
   ```
3. If no logs appear, the entrypoint may be failing silently. Redeploy after pulling latest changes.

### nginx Not Starting

**Symptom:** React app doesn't load but code-server might work directly

**Fix:** Ensure the `nginx.conf` is being copied correctly. The Dockerfile copies it to `/etc/nginx/conf.d/default.conf`. Check that the build context includes the `docker/` directory.

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
┌─────────────────────────────────────────┐
│  Container (runs as root)               │
│                                         │
│  entrypoint.sh                          │
│  ├── nginx (background, port 8080)      │
│  │   ├── /          → React app         │
│  │   ├── /api/*     → code-server:8081  │
│  │   └── /websocket → code-server:8081  │
│  │                                      │
│  └── code-server (PID 1, port 8081)     │
│      └── VS Code server (127.0.0.1)     │
└─────────────────────────────────────────┘
```

### File Structure

```
docker/
├── Dockerfile        # Multi-stage build: React builder + code-server + nginx
├── entrypoint.sh     # Starts nginx, then exec code-server
└── nginx.conf        # Reverse proxy config for port 8080

wrapper/app/          # React mobile wrapper source
├── src/
│   ├── components/   # AI, Teams, Users, Notifications, etc.
│   ├── pages/        # Dashboard, Editor, Terminal, Explorer
│   └── api/          # API client modules
└── dist/             # Built output (copied to container)
```

## Security Notes

- Authentication is **disabled by default**. Set `AUTH_TYPE=password` or configure code-server authentication before exposing to the internet.
- The container runs as root internally (required for nginx + code-server dual process). This is standard for single-purpose containers.
- Use HTTPS in production. Dokploy integrates with Let's Encrypt for automatic SSL certificates.
