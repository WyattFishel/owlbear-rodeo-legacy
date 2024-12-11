# DEVELOPMENT DOCKERFILE ONLY
# THIS DOCKERFILE IS NOT INTENDED FOR PRODUCTION. IT LEVERAGES DEVELOPMENT DEPENDENCIES TO RUN.

FROM node:18.20.0-alpine3.18 AS builder

RUN mkdir /home/node/app/ && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY --chown=node:node package.json ./ 
COPY --chown=node:node package-lock.json ./ 

USER node
RUN npm install --production=false --legacy-peer-deps && npm cache clean --force

FROM node:18.20.0-alpine3.18
USER node
ENV NODE_ENV production
WORKDIR /home/node/app
COPY --chown=node:node package.json ./ 
COPY --chown=node:node package-lock.json ./ 
COPY --chown=node:node tsconfig.json ./ 
COPY --chown=node:node ./src/ ./src
COPY --chown=node:node ./public/ ./public
COPY --chown=node:node --from=builder /home/node/app/node_modules ./node_modules

CMD ["npm", "start"]
