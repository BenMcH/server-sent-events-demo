FROM node:20-alpine

WORKDIR /app
ADD . .
RUN npm ci

CMD npm start
