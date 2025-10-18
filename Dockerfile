FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install a simple HTTP server
RUN npm install -g http-server

# Copy website files
COPY *.html ./
COPY *.png ./
COPY js/ ./js/
COPY videos/ ./videos/
COPY docs/ ./docs/

# Expose port
EXPOSE $PORT

# Start the server
CMD ["sh", "-c", "http-server -p $PORT -c-1 --cors"]