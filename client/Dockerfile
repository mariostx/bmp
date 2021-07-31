FROM node:14.17.4-alpine3.12
WORKDIR /usr/app
COPY package*.json ./
RUN npm install -qy
COPY . .

CMD ["npm", "run", "start"]
