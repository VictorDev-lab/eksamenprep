# Multi-stage build for full-stack app
# Stage 1: Build backend
FROM node:18-alpine AS backend-build
WORKDIR /app
COPY backend/package*.json ./
RUN npm install
COPY backend/ ./

# Stage 2: Final image with Nginx for frontend and backend
FROM nginx:alpine
# Install Node.js for running backend
RUN apk add --no-cache nodejs npm
# Copy backend from build stage
COPY --from=backend-build /app /app
# Copy frontend static files
COPY frontend/ /usr/share/nginx/html
# Copy custom nginx config
COPY nginx.conf /etc/nginx/nginx.conf
# Copy start script
COPY start.sh /start.sh
RUN chmod +x /start.sh
# Set working directory for backend
WORKDIR /app
# Expose port 80 for Nginx
EXPOSE 80
# Start both
CMD ["/start.sh"]