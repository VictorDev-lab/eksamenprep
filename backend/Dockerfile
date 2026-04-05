FROM node:20-alpine

WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies with verbose output
RUN npm install --loglevel=verbose

# Copy application
COPY . .

EXPOSE 10000

# Start with node (ikke nodemon i production)
CMD ["node", "server.js"]