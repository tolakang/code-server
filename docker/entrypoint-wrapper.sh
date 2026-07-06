#!/bin/sh
set -e

# Unset PORT to prevent code-server from trying to bind to it.
# Dokploy/Traefik will use port 8080 which our Express server will handle.
unset PORT

# Execute the original entrypoint
exec /usr/bin/entrypoint.sh "$@"
