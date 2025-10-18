# Use nginx to serve static files
FROM nginx:alpine

# Install curl for health checks
RUN apk add --no-cache curl

# Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

# Copy website files to nginx html directory
COPY *.html /usr/share/nginx/html/
COPY *.png /usr/share/nginx/html/
COPY js/ /usr/share/nginx/html/js/
COPY videos/ /usr/share/nginx/html/videos/
COPY docs/ /usr/share/nginx/html/docs/

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy health check script
COPY healthcheck.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/healthcheck.sh

# Test nginx configuration
RUN nginx -t

# Create log directory and set permissions
RUN mkdir -p /var/log/nginx && \
    chmod 755 /var/log/nginx

# Set proper permissions for html directory
RUN chmod -R 755 /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
    CMD /usr/local/bin/healthcheck.sh

# Start nginx
CMD ["nginx", "-g", "daemon off;"]