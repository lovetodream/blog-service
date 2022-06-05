FROM node:16-alpine

WORKDIR /app

COPY . /app

RUN npm ci

ENV NODE_ENV production

EXPOSE 4000

CMD ["node", "index.js"]
