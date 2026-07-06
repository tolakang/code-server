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
# Ensure PORT is 8080 for Express
PORT=8080 node src/index.js &
BACKEND_PID=$!

# Wait for backend to be ready (max 60s)
echo "Waiting for Express backend to be ready..."
for i in $(seq 1 60); do
  if curl -s http://127.0.0.1:8080/health > /dev/null 2>&1; then
    echo "Express backend ready on port 8080 (pid=$BACKEND_PID)"
    exit 0
  fi
  if ! kill -0 $BACKEND_PID 2>/dev/null; then
    echo "ERROR: Express backend process died"
    exit 1
  fi
  sleep 1
done

echo "WARNING: Express backend did not start in 60s, continuing anyway"

# Unset PORT so code-server doesn't try to bind to 8080 (which Express is using)
# This script is executed by code-server's entrypoint.sh via find ... -exec {} \;
# Unsetting PORT here won't affect the parent shell, so we need to rely on the
# --bind-addr flag in the Dockerfile CMD. However, code-server often respects
# the PORT env var if it's set.
# To be safe, we'll suggest unsetting it in the main entrypoint if possible,
# or ensure the CMD is robust.
exit 0
