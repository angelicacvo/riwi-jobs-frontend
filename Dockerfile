# ==========================================
# Dockerfile - Riwi Jobs Frontend
# ==========================================
# Multi-stage build for production
# Stack: React + Vite + TypeScript + Nginx
# Compatible: Railway + Docker Compose
# ==========================================

# ========================================
# Stage 1: Build Stage
# ========================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including devDependencies needed for build)
RUN npm ci && npm cache clean --force

# Copy source code
COPY . .

# Build arguments for environment variables
ARG VITE_API_URL
ARG VITE_API_KEY

# Set environment variables for build
ENV VITE_API_URL=${VITE_API_URL:-https://riwi-jobs-production.up.railway.app}
ENV VITE_API_KEY=${VITE_API_KEY:-angelica-secure-api-key-2026}

# Build the application (VITE variables are embedded here)
RUN npm run build

# ========================================
# Stage 2: Production Stage (Nginx)
# ========================================
FROM nginx:alpine

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Copy built app to nginx html directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Create a startup script to handle PORT environment variable
RUN echo '#!/bin/sh' > /docker-entrypoint.sh && \
    echo 'PORT=${PORT:-8080}' >> /docker-entrypoint.sh && \
    echo 'sed -i "s/listen 8080/listen $PORT/g" /etc/nginx/conf.d/default.conf' >> /docker-entrypoint.sh && \
    echo 'exec nginx -g "daemon off;"' >> /docker-entrypoint.sh && \
    chmod +x /docker-entrypoint.sh

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s \
  CMD wget --quiet --tries=1 --spider http://localhost:${PORT:-8080}/health || exit 1

# Start nginx with proper signal handling
CMD ["dumb-init", "/docker-entrypoint.sh"]
