#!/bin/bash
set -e

# Fix ownership of nginx runtime directories
chown -R coder:coder /var/cache/nginx /var/lib/nginx /var/log/nginx
mkdir -p /var/log/nginx /var/lib/nginx /var/cache/nginx
touch /var/run/nginx.pid
chown -R coder:coder /var/run/nginx.pid

# Start nginx as coder user in background
su -s /bin/bash -c 'nginx -g "daemon on;"' coder

# Start code-server as coder user (exec replaces this process)
exec su -s /bin/bash coder -c 'exec "$0" "$@"' -- code-server "$@"
