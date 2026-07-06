#!/bin/bash
set -e

# Start nginx in background
nginx

# Start code-server (replaces this process, becomes PID 1)
exec code-server "$@"
