#!/bin/bash
set -e

# Start code-server in the background
/usr/bin/entrypoint.sh "$@" &

# Wait a moment for code-server to start
sleep 5

# Keep the container running
tail -f /dev/null