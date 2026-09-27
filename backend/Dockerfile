# Use a lightweight Node image
FROM node:20-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

# Expose your API port (assuming 5000 based on your previous code)
EXPOSE 5000

# Start the server
CMD [ "npm", "start" ] 
# (Change "npm start" to "node server.js" or whatever your start command is)