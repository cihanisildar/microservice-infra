FROM node:22-alpine 
WORKDIR /app

COPY . .
RUN npm install
RUN npm run build --workspace=@developer-infrastructure/shared-types
RUN npm run build --workspace=@developer-infrastructure/logger
RUN npm run build --workspace=@developer-infrastructure/amqp
RUN npm run build --workspace=@developer-infrastructure/auth

EXPOSE 3001
WORKDIR /app/services/auth
CMD ["node", "dist/index.js"]