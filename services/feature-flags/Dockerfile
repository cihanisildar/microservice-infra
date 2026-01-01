FROM node:22-alpine 

WORKDIR /app

COPY services/feature-flags/package*.json .

RUN npm install 

COPY services/feature-flags/src ./src
COPY services/feature-flags/tsconfig.json .

RUN npm run build

EXPOSE 3004

CMD ["npm", "run", "start"]