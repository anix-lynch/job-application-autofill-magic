# 🐳 Production-Ready Job Application Automation
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    freetype-dev \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    curl

# Set Puppeteer to use installed Chromium
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Create directories for data persistence
RUN mkdir -p /app/profiles /app/logs /app/cache && \
    chmod 755 /app/profiles /app/logs /app/cache

# Copy application files
COPY . .

# Create non-root user for security
RUN addgroup -g 1001 -S jobuser && \
    adduser -S jobuser -u 1001 -G jobuser

# Change ownership of app directory
RUN chown -R jobuser:jobuser /app

# Switch to non-root user
USER jobuser

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/health || exit 1

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]