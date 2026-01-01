FROM node:22-alpine 

WORKDIR /app

COPY services/config/package*.json .

RUN npm install 

COPY services/config/src ./src
COPY services/config/tsconfig.json .

RUN npm run build

EXPOSE 3002

CMD ["npm", "run", "start"]