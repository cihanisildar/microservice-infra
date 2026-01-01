FROM node:22-alpine 

WORKDIR /app

COPY services/rate-limit/package*.json .

RUN npm install 

COPY services/rate-limit/src ./src
COPY services/rate-limit/tsconfig.json .

RUN npm run build

EXPOSE 3007

CMD ["npm", "run", "start"]