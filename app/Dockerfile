FROM node:10.15.3-alpine

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install
# RUN npm install -g pm2

COPY . .

EXPOSE 8080
EXPOSE 9200

CMD npm run start