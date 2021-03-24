FROM node:alpine

WORKDIR /usr/src/app

COPY package.json .

RUN npm install --silent --only=prod

COPY . .

RUN apk --no-cache add curl

EXPOSE 3000

CMD [ "npm", "start" ]
