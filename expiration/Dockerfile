FROM node:alpine

WORKDIR /usr/src/app

COPY package.json .

RUN npm install --silent --only=prod

COPY . .

CMD [ "npm", "start" ]
