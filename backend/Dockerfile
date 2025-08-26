# Use Node.js LTS
FROM node:18-alpine

# Create app directory
WORKDIR /app

# Copy dependencies
COPY package*.json ./
RUN npm install

# Copy all source code
COPY . .

# Build TypeScript into dist/
RUN npm run build

# Expose port (adjust if needed)
EXPOSE 8080

# Start app (runs dist/index.js)
CMD ["npm", "start"]
