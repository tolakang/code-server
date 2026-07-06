#!/bin/bash
# This script runs via code-server's ENTRYPOINTD mechanism
# It starts nginx and the backend BEFORE code-server launches
set -e

echo "=== Mobile Code Server: Starting services ==="
echo "DB_HOST=${DB_HOST:-not set}"
echo "DATABASE_URL set: ${DATABASE_URL:+yes}"
echo "CODE_SERVER_ADDRESS=${CODE_SERVER_ADDRESS:-not set}"

# Start nginx in background
nginx
echo "nginx started on port 8080"

# Start backend server in background
cd /home/coder/server
node src/index.js &
BACKEND_PID=$!

# Wait for backend to be ready (max 30s)
for i in $(seq 1 30); do
  if curl -s http://127.0.0.1:3000/health > /dev/null 2>&1; then
    echo "backend ready on port 3000 (pid=$BACKEND_PID)"
    exit 0
  fi
  sleep 1
done

echo "WARNING: backend did not start in 30s, continuing anyway"
exit 0
