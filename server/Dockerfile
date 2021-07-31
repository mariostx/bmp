FROM node:14.17.4-alpine3.12

RUN mkdir -p /app
WORKDIR /app

COPY package.json /app
COPY . /app

RUN npm install

#CMD ["npm", "start"]
CMD ["node", "index.js"]
