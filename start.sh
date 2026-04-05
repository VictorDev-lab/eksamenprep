#!/bin/sh
# Ensure backend listens on the port Nginx expects
export PORT=3000

# Start backend in background
npm start &
BACKEND_PID=$!

# Wait a bit for backend to start
sleep 2

# Start Nginx in foreground (so if it crashes we see it)
nginx -g "daemon off;"
