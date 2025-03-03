FROM node:18-slim

# Install system dependencies
RUN apt-get update -y && \
    apt-get install -y openssl netcat-traditional

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy Prisma schema and application files
COPY prisma ./prisma/
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Make start script executable
RUN chmod +x start.sh

# Start the application
CMD ["/bin/bash", "./start.sh"] 