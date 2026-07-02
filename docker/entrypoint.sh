#!/bin/bash
set -e

# Start nginx in the background
nginx -g 'daemon off;' &

# Wait a moment for nginx to start
sleep 2

# Execute the original code-server entrypoint with the arguments passed to this script
# The original entrypoint is at /usr/bin/entrypoint.sh in the base image
exec /usr/bin/entrypoint.sh "$@"