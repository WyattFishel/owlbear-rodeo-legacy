# DEVELOPMENT DOCKERFILE ONLY
# THIS DOCKERFILE IS NOT INTENDED FOR PRODUCTION. IT LEVERAGES DEVELOPMENT DEPENDENCIES TO RUN.

FROM node:18.20.0-alpine3.18 AS builder

RUN mkdir /home/node/app/ && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY --chown=node:node package.json ./ 
COPY --chown=node:node package-lock.json ./ 

USER node
RUN npm install --production=false --legacy-peer-deps && npm cache clean --force

# Copy application code
COPY --chown=node:node ./src/ ./src
COPY --chown=node:node ./public/ ./public

# Build the app (if needed)
RUN npm run build

# Build production image
FROM node:18.20.0-alpine3.18

USER node
ENV NODE_ENV production
WORKDIR /home/node/app

# Copy package files to production image
COPY --chown=node:node package.json ./ 
COPY --chown=node:node package-lock.json ./ 

# Copy only production node_modules from builder stage
COPY --chown=node:node --from=builder /home/node/app/node_modules ./node_modules

# Copy build artifacts from builder stage
COPY --chown=node:node --from=builder /home/node/app/build ./build

# If you need to use tsconfig.json in production, keep this line
# COPY --chown=node:node tsconfig.json ./ 

# Expose the port (if needed)
EXPOSE 3000
EXPOSE 9000

CMD ["npm", "start"]
