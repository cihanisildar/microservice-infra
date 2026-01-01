FROM node:22-alpine 

WORKDIR /app

COPY services/worker/package*.json .

RUN npm install 

COPY services/worker/src ./src
COPY services/worker/tsconfig.json .

RUN npm run build

EXPOSE 3008

CMD ["npm", "run", "start"]