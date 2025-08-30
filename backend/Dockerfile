# Use Node.js LTS
FROM node:18-alpine

# Create app directory
WORKDIR /app

# Copy package.json and tsconfig.json first (for better caching)
COPY package*.json tsconfig.json ./

# Install dependencies
RUN npm install

# Copy rest of the source code
COPY . .

# Build TypeScript into dist/
RUN npm run build

# Expose the correct port (matches your Express app)
EXPOSE 5000

# Start the app
CMD ["npm", "start"]
