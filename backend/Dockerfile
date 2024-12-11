# DEVELOPMENT DOCKERFILE ONLY
# THIS DOCKERFILE IS NOT INTENDED FOR PRODUCTION. IT LEVERAGES DEVELOPMENT DEPENDENCIES TO RUN.

FROM node:18.20.0-alpine3.18 AS builder

# Set up the application directory
RUN mkdir /home/node/app/ && chown -R node:node /home/node/app

WORKDIR /home/node/app

# Copy package.json and package-lock.json for npm install
COPY --chown=node:node package.json ./
COPY --chown=node:node package-lock.json ./

# Install development dependencies and build the app
USER node
RUN npm install --production=false --legacy-peer-deps && npm cache clean --force

# Copy source code and build files
COPY ./src/ ./src
COPY ./tsconfig.json ./
RUN npm run build

# Build the production image (no need for a separate 'install' stage)
FROM node:18.20.0-alpine3.18

USER node
ENV NODE_ENV production
WORKDIR /home/node/app

# Copy only production package files (package.json, package-lock.json)
COPY --chown=node:node package.json ./
COPY --chown=node:node package-lock.json ./
COPY --chown=node:node ice.json ./

# Copy build artifacts from the builder stage
COPY --chown=node:node --from=builder /home/node/app/build ./build

# Copy node_modules from the builder stage (dependencies installed during the build stage)
COPY --chown=node:node --from=builder /home/node/app/node_modules ./node_modules

# Expose port (optional, if your app listens on a specific port)
EXPOSE 3000

# Run the app with Node.js
CMD ["node", "--es-module-specifier-resolution=node", "./build/index.js"]
