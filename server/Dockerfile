FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ENV port=8080
EXPOSE 8080

CMD ["npm", "start"]
