#
# 🧑‍💻 Development
#
FROM node:22-alpine

RUN apk add --no-cache bash

WORKDIR /home/node/app

RUN mkdir -p node_modules && chown -R node:node /home/node/app

USER node

COPY --chown=node:node . .

EXPOSE 13000
