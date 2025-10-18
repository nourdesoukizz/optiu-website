# Use nginx to serve static files
FROM nginx:alpine

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

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]