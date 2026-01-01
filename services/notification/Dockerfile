FROM node:22-alpine 

WORKDIR /app

COPY services/notification/package*.json .

RUN npm install 

COPY services/notification/src ./src
COPY services/notification/tsconfig.json .

RUN npm run build

EXPOSE 3006

CMD ["npm", "run", "start"]