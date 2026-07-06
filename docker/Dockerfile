# Mobile Code Server Dockerfile
# Based on upstream code-server with mobile wrapper additions

# Builder stage for the React app
FROM node:20 AS builder
WORKDIR /home/coder

# Copy the wrapper directory (excluding node_modules)
COPY wrapper/app/package*.json ./
RUN npm ci
COPY wrapper/app/ ./app/
RUN npm run build --prefix ./app

# Builder stage for the backend
FROM node:20 AS backend-builder
WORKDIR /home/coder/server

# Install backend dependencies
COPY server/package*.json ./
RUN npm ci --omit=dev

# Final stage
FROM codercom/code-server:latest

# Set environment
ENV HOME=/home/coder
WORKDIR $HOME

# Install git and nodejs (Node 20 from NodeSource)
# No nginx needed — Express serves everything on port 8080
USER root
RUN mkdir -p /var/lib/apt/lists/partial && \
    apt-get update && \
    apt-get install -y --no-install-recommends \
        ca-certificates \
        curl \
        git \
        && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
        && apt-get install -y --no-install-recommends nodejs \
        && rm -rf /var/lib/apt/lists/*

# Copy built React app from builder stage
COPY --from=builder /home/coder/app/dist /home/coder/app/dist

# Copy backend dependencies from builder stage
COPY --from=backend-builder /home/coder/server/node_modules /home/coder/server/node_modules

# Copy backend server source
COPY server/ /home/coder/server/

# Write code-server config: bind to port 8081 (internal only, Express proxies on 8080)
# NOTE: code-server ignores --bind-addr CLI flag in Docker. The config file is
# the only way to change the port, but it may also be ignored. So we also set
# CODE_SERVER_PORT env var as a fallback.
RUN mkdir -p $HOME/.config/code-server $HOME/.local/share/code-server $HOME/project && \
    printf 'bind-addr: 127.0.0.1:8081\nauth: none\ncert: false\n' > $HOME/.config/code-server/config.yaml && \
    chown -R coder:coder $HOME

# Force code-server to use port 8081 via XDG_CONFIG_HOME
ENV XDG_CONFIG_HOME=/home/coder/.config

# Use code-server's ENTRYPOINTD to start the Express backend BEFORE code-server
RUN mkdir -p /usr/local/share/code-server-startup
COPY docker/startup.sh /usr/local/share/code-server-startup/01-start-services.sh
RUN chmod +x /usr/local/share/code-server-startup/01-start-services.sh

ENV ENTRYPOINTD=/usr/local/share/code-server-startup

# Expose port (Traefik will route traffic)
EXPOSE 8080

# Keep the ORIGINAL code-server entrypoint
ENTRYPOINT ["/usr/bin/entrypoint.sh"]
CMD ["--bind-addr", "127.0.0.1:8081", "--auth", "none", "--disable-telemetry", "/home/coder/project"]
