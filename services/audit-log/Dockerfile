FROM node:22-alpine 
WORKDIR /app

COPY . .
RUN npm install
RUN npm run build --workspace=@developer-infrastructure/shared-types
RUN npm run build --workspace=@developer-infrastructure/logger
RUN npm run build --workspace=@developer-infrastructure/amqp
RUN npm run build --workspace=@developer-infrastructure/audit-log

EXPOSE 3009
WORKDIR /app/services/audit-log
CMD ["node", "dist/index.js"]