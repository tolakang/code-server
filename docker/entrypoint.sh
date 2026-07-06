#!/bin/bash
set -e

# Start backend server in background
cd /home/coder/server
node src/index.js &

# Wait for backend to start
sleep 2

# Start nginx in background
nginx

# Start code-server (replaces this process, becomes PID 1)
exec code-server "$@"
