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

# Install dependencies, nginx, and nodejs (Node 20 from NodeSource)
USER root
RUN mkdir -p /var/lib/apt/lists/partial && \
    apt-get update && \
    apt-get install -y --no-install-recommends \
        ca-certificates \
        curl \
        git \
        nginx \
        && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
        && apt-get install -y --no-install-recommends nodejs \
        && rm -rf /var/lib/apt/lists/*

# Copy nginx config
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
RUN rm -f /etc/nginx/sites-enabled/default

# Copy built React app from builder stage
COPY --from=builder /home/coder/app/dist /var/www/html

# Copy backend dependencies from builder stage
COPY --from=backend-builder /home/coder/server/node_modules /home/coder/server/node_modules

# Copy backend server source
COPY server/ /home/coder/server/

# Use code-server's ENTRYPOINTD mechanism to start nginx + backend BEFORE code-server
# The original /usr/bin/entrypoint.sh runs scripts in $ENTRYPOINTD before launching code-server
RUN mkdir -p /usr/local/share/code-server-startup
COPY docker/startup.sh /usr/local/share/code-server-startup/01-start-services.sh
RUN chmod +x /usr/local/share/code-server-startup/01-start-services.sh

# Write code-server config: bind to 8081 (nginx on 8080)
RUN mkdir -p $HOME/.config/code-server $HOME/.local/share/code-server $HOME/project && \
    printf 'bind-addr: 127.0.0.1:8081\nauth: none\ncert: false\n' > $HOME/.config/code-server/config.yaml && \
    chown -R coder:coder $HOME

# EntrypointD: scripts here run before code-server starts
ENV ENTRYPOINTD=/usr/local/share/code-server-startup

# Expose port (Traefik will route traffic)
EXPOSE 8080

# Keep the ORIGINAL code-server entrypoint, pass bind-addr via CMD
ENTRYPOINT ["/usr/bin/entrypoint.sh"]
CMD ["--bind-addr", "127.0.0.1:8081", "--auth", "none", "--disable-telemetry", "/home/coder/project"]
