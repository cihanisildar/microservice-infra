FROM node:22-alpine 
WORKDIR /app

# Copy the entire monorepo
COPY . .

# Install dependencies for the whole workspace
RUN npm install

# Build the gateway and its dependencies
RUN npm run build --workspace=@developer-infrastructure/shared-types
RUN npm run build --workspace=@developer-infrastructure/logger
RUN npm run build --workspace=@developer-infrastructure/gateway

# Remove source code to keep it clean (optional, but good for debugging)
# RUN rm -rf packages/*/src services/*/src

EXPOSE 3000

# Run with node directly to avoid npm noise and catching errors better
WORKDIR /app/services/gateway
CMD ["node", "dist/index.js"]