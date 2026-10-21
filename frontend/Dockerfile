#
# 🚀 Build servido pelo vite preview
#
FROM node:22-alpine

RUN apk add --no-cache bash

WORKDIR /home/node/app

RUN chown node:node /home/node/app

USER node

COPY --chown=node:node package.json package-lock.json ./

RUN npm ci

COPY --chown=node:node . .

ARG VITE_API_URL=http://localhost:3000/api/v1
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

EXPOSE 5173

CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "5173", "--strictPort"]
