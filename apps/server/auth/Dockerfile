# Base image
FROM node:22.12.0-slim

# Create app directory
WORKDIR /usr/src/app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY ./dist/apps/server/auth/package.json ./package.json

# Install app dependencies
# Install pg packgae for postgres database
RUN npm install pg --force

# Bundle app source
COPY ./dist/apps/server/auth ./dist

# Creates a "dist" folder with the production build
# RUN npm run build:auth

# Start the server using the production build
CMD [ "node", "dist/main.js" ]
