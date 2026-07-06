#!/bin/bash
# This script runs via code-server's ENTRYPOINTD mechanism
# It starts the Express backend BEFORE code-server launches
set -e

echo "=== Mobile Code Server: Starting services ==="
echo "DB_HOST=${DB_HOST:-not set}"
echo "DATABASE_URL set: ${DATABASE_URL:+yes}"
echo "PORT=${PORT:-8080}"

# Start the Express backend on port 8080 (serves React app + API + WebSocket proxy)
cd /home/coder/server
node src/index.js &
BACKEND_PID=$!

# Wait for backend to be ready (max 30s)
for i in $(seq 1 30); do
  if curl -s http://127.0.0.1:${PORT:-8080}/health > /dev/null 2>&1; then
    echo "Express backend ready on port ${PORT:-8080} (pid=$BACKEND_PID)"
    exit 0
  fi
  sleep 1
done

echo "WARNING: Express backend did not start in 30s, continuing anyway"
exit 0
