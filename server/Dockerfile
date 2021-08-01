FROM node:14.17.4-alpine3.12

RUN apk update

RUN mkdir -p /app
WORKDIR /app

COPY package.json ./
COPY tsconfig.json ./
COPY . ./

RUN npm install
RUN npm run build

#CMD ["npm", "start"]
CMD ["node", "index.js"]
