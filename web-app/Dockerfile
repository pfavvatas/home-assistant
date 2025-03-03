FROM node:18-slim

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies including react-markdown
RUN npm install && npm install react-markdown

# Copy the rest of the application
COPY . .

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"] 