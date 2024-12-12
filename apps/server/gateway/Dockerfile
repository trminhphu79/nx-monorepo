# Base image
FROM node:22.12.0-slim

# Create app directory
WORKDIR /usr/src/app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY ./dist/apps/server/gateway/package.json ./package.json

# Install app dependencies
RUN npm install --force

# Bundle app source
COPY ./dist/apps/server/gateway ./dist

# Creates a "dist" folder with the production build
# RUN npm run build:gateway

# Start the server using the production build
CMD [ "node", "dist/main.js" ]
