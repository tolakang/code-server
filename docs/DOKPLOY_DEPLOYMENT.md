# Dokploy Deployment Guide

## Quick Summary

You need **2 services** in Dokploy:

| # | Type | Name | Config |
|---|------|------|--------|
| 1 | **Application** | `mobile-code-server` | Git source, Dockerfile `docker/Dockerfile`, port `8080` |
| 2 | **Database** | `mobile-code-server-db` | PostgreSQL |

That's it. One container, one database.

---

## Architecture

```
Internet → Dokploy Traefik → Container :8080 → Express
  ├── /                    → React app (static)
  ├── /api/*               → REST API → PostgreSQL
  └── /absproxy/*          → WebSocket proxy → code-server (:8081 internal)
```

- **Express** (port 8080) — serves React app, handles API, proxies WebSocket to code-server
- **code-server** (port 8081, internal) — VS Code server, not exposed directly
- **PostgreSQL** — stores users, teams, audit logs, workspaces

---

## Prerequisites

- Dokploy running on your server
- A domain pointed to your server (e.g., `code.example.com`)
- GitHub account

---

## Step 1: Fork & Clone

```bash
# Fork https://github.com/tolakang/code-server on GitHub, then:
git clone https://github.com/YOUR_USERNAME/code-server.git mobile-code-server
cd mobile-code-server
```

## Step 2: Create Dokploy Project

1. Dokploy dashboard → **Create Project**
2. Name: `mobile-code-server`

## Step 3: Connect Git

1. Project → **Git** tab
2. Provider: **GitHub**
3. Repository: your fork
4. Branch: **`master`**
5. Save

## Step 4: Build Settings

1. Project → **Settings** tab
2. Under **Build Configuration**:
   - **Dockerfile Location:** `docker/Dockerfile`
   - **Build Context:** `.`
3. Save

> The path must be exactly `docker/Dockerfile`. Leave nothing blank.

## Step 5: Add Domain

1. Project → **Domains** tab → **Add Domain**
2. Domain: `code.example.com`
3. Internal Port: **`8080`**
4. HTTPS: Enable
5. Save

## Step 6: Create Database

1. Project → **Databases** tab → **Create Database**
2. Type: **PostgreSQL**
3. Database Name: `mobile_code_server`
4. Username: `postgres`
5. Password: generate a strong one
6. Save
7. **Copy the Internal Connection URL** — you'll need it next

> The Internal Host looks like: `dev-production-mobile-code-server-xxxxx`

## Step 7: Environment Variables

Project → **Settings** tab → **Environment** → Add these variables:

### Required

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | Paste the full Internal Connection URL from Step 6 |
| `JWT_SECRET` | Run `openssl rand -hex 32` and paste the result |
| `SESSION_SECRET` | Run `openssl rand -hex 32` again and paste the result |

### Optional (defaults are fine)

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `8080` | Don't change this |
| `AUTH_TYPE` | `none` | Set to `password` to enable login |
| `NODE_ENV` | `production` | Don't change this |
| `LOG_LEVEL` | `info` | Set to `debug` if troubleshooting |

> **About DATABASE_URL:** If you used a Dokploy managed database, paste the full connection URL from the database's connection settings. If you have an external PostgreSQL, format: `postgresql://user:password@host:5432/dbname`

## Step 8: Deploy

1. Project → **Deployments** tab → **Deploy**
2. Wait 3-5 minutes for the build
3. Check logs for errors

### Expected startup logs (in order):

```
=== Mobile Code Server: Starting services ===
Database connected
Ran X migration(s): batch 1
Server running on http://0.0.0.0:8080
Express backend ready on port 8080
```

## Step 9: Verify

Visit `https://code.example.com` — you should see the Mobile Code Server dashboard.

Test these:
- [ ] Dashboard loads
- [ ] Editor opens
- [ ] Terminal works
- [ ] File explorer works

---

## Troubleshooting

### Bad Gateway

| Check | How |
|-------|-----|
| Container running? | Deployments tab → check for errors |
| Port correct? | Domain must be set to internal port **8080** |
| Backend started? | Logs should show `Server running on http://0.0.0.0:8080` |

### Database Connection Error

| Check | How |
|-------|-----|
| `DATABASE_URL` correct? | Must use **Internal** host, not External |
| Database exists? | Databases tab → check status |
| Password right? | Match the password you set when creating the database |

### Editor/Terminal Not Working

code-server runs on port 8081 internally. If it fails:
1. Logs should show code-server starting
2. Check for `EADDRINUSE` errors — means another process is using the port
3. Restart the deployment

### Build Fails

| Error | Fix |
|-------|-----|
| `apt-get` permission error | Update to latest `master` branch |
| Missing import error | Run `git pull origin master` |
| npm ci fails | Check `server/package-lock.json` exists |

---

## Updating

```bash
git pull origin master
git push origin master
```

Then in Dokploy: **Deploy** to trigger a rebuild.

---

## Security

- Auth is **off by default**. Set `AUTH_TYPE=password` before going public.
- Use `openssl rand -hex 32` for secrets.
- Enable HTTPS in Dokploy domain settings.
- code-server (port 8081) is internal only — never exposed directly.
