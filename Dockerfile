# Dockerfile for Riwi Jobs Frontend
# Simple Vite + React application for Railway

FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Install serve to run the built app
RUN npm install -g serve

# Expose port
EXPOSE 8080

# Start the application
CMD ["serve", "-s", "dist", "-l", "8080"]
