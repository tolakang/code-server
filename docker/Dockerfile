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

# Final stage
FROM codercom/code-server:latest

# Set environment
ENV HOME=/home/coder
WORKDIR $HOME

# Install dependencies for code-server
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        ca-certificates \
        curl \
        git \
        && rm -rf /var/lib/apt/lists/*

# Copy built React app from builder stage
COPY --from=builder /home/coder/app/dist /var/www/html

# Copy custom entrypoint script
COPY docker/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

# Create necessary directories for code-server
RUN mkdir -p \
    $HOME/.local/share/code-server \
    $HOME/.config/code-server \
    $HOME/project \
    && chown -R coder:coder $HOME

# Expose port (Traefik will route traffic)
EXPOSE 8080

# Switch to coder user
USER coder

# Entrypoint and command
# We'll start nginx and then code-server on localhost:8081
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["--bind-addr", "127.0.0.1:8081", "--auth", "none", "--disable-telemetry", "."]