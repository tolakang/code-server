# Dokploy Deployment Guide

## Prerequisites
- Dokploy server installed and running
- Domain pointed to your Dokploy server
- Docker installed on your Dokploy server

## Deployment Steps

### 1. Fork and Clone Repository
```bash
# Fork https://github.com/tolakang/code-server to your own GitHub account
git clone https://github.com/YOUR_USERNAME/code-server.git mobile-code-server
cd mobile-code-server
```

### 2. Configure Dokploy
1. Log into your Dokploy dashboard
2. Click "New Project"
3. Name your project (e.g., "mobile-code-server")
4. Connect your GitHub repository
5. Select the `main` branch

### 3. Configure Environment Variables
Add the following environment variables in Dokploy:
- `PUID=1000`
- `PGID=1000`
- `TZ=UTC`

### 4. Configure Dockerfile
Dokploy will automatically detect your Dockerfile. Ensure it's located at:
`docker/Dockerfile`

### 5. Configure Docker Compose (Optional)
If you prefer to use Docker Compose instead of the Dockerfile directly:
1. Ensure `docker-compose.yml` is in your repository root
2. In Dokploy project settings, select "Use Docker Compose"
3. Dokploy will use your `docker-compose.yml` file

### 6. Set Up Domains
1. In your Dokploy project, go to "Domains"
2. Add your domain (e.g., `code.yourdomain.com`)
3. Enable SSL/TLS (Let's Encrypt is integrated)

### 7. Configure Persistent Storage
To preserve your workspaces and settings:
1. Go to "Volumes" in your Dokploy project
2. Create volume mappings:
   - `/home/coder/project` → `project-data` (for your workspace)
   - `/home/coder/.local/share/code-server` → `code-server-data` (for extensions and settings)
   - `/home/coder/.config/code-server` → `code-server-config` (for code-server configuration)

### 8. Deploy
Click "Deploy" and wait for Dokploy to build and deploy your application.

### 9. Access Your Mobile Code Server
Once deployed, visit your domain to access the mobile-optimized code server interface.

## Architecture Notes
This deployment follows the architecture outlined in the plan:
- Dokploy handles the reverse proxy (similar to Traefik in the diagram)
- The Docker container runs both code-server and the mobile wrapper
- The mobile wrapper serves as the entry point and communicates with code-server via localhost
- Persistent storage ensures your workspaces and settings survive container restarts

## Maintenance
- To update to the latest upstream code, Dokploy will automatically rebuild on pushes to your fork
- You can also trigger manual rebuilds from the Dokploy dashboard
- Monitor logs in the Dokploy dashboard for any issues