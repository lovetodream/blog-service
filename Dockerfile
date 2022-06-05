FROM node:16-alpine

ENV NODE_ENV production

EXPOSE 4000

CMD ["node", "index.js"]
