#!/bin/bash

# Generate self-signed SSL certificate for local development
# In production, use Let's Encrypt or proper SSL certificates

mkdir -p ssl

openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout ssl/key.pem \
  -out ssl/cert.pem \
  -subj "/C=US/ST=State/L=City/O=Organization/CN=localhost"

echo "✅ Self-signed SSL certificate generated in ssl/ directory"
echo "⚠️  For production, replace with proper SSL certificates!"
