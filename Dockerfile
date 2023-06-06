FROM node:18.15

WORKDIR /usr/app
COPY package*.json ./
RUN npm install
COPY . .
COPY .env ./.env

RUN npm i -g prisma
RUN npx prisma generate --schema ./prisma/schema.prisma

EXPOSE 3000
ENTRYPOINT npm run dev