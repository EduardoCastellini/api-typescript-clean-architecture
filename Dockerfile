FROM node:12

WORKDIR /usr/src/api-typescript-clean

COPY ./package.json .

RUN npm install --only=prod
