#!/bin/bash
set -e

echo "=== Mobile Code Server Starting ==="
echo "DB_HOST=${DB_HOST:-not set}"
echo "DATABASE_URL=${DATABASE_URL:+(set)}"

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
    echo "backend ready on port 3000"
    break
  fi
  if [ $i -eq 30 ]; then
    echo "WARNING: backend not ready after 30s, continuing anyway"
  fi
  sleep 1
done

# Start code-server on port 8081
echo "starting code-server on 127.0.0.1:8081"
exec code-server \
  --bind-addr 127.0.0.1:8081 \
  --auth none \
  --disable-telemetry \
  /home/coder/project
