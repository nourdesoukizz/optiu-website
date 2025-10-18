#!/bin/sh
# Simple health check script for testing

echo "Testing health endpoint..."

# Test health endpoint
curl -f http://localhost/health || exit 1

echo "Health check passed!"
exit 0