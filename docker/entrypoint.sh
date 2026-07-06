#!/bin/bash
set -e

# Start backend server in background
cd /home/coder/server
node src/index.js &

# Wait for backend to be ready (check port 3000)
for i in $(seq 1 30); do
  if curl -s http://127.0.0.1:3000/api/users > /dev/null 2>&1; then
    break
  fi
  sleep 1
done

# Start nginx in background
nginx

# Start code-server with explicit bind address (ignores config file defaults)
exec code-server --bind-addr 127.0.0.1:8081 --auth none --disable-telemetry .
